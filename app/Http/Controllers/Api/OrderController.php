<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $orders = $request->user()->is_admin
            ? Order::with(['items.product', 'user'])->latest()->get()
            : $request->user()->orders()->with('items.product')->latest()->get();

        return OrderResource::collection($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.use_points' => 'sometimes|boolean',
            'payment_method' => 'required|string',
            'payment_proof' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            DB::beginTransaction();

            $totalPrice = 0;
            $totalPointsRequired = 0;
            $totalPointsEarned = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $usePoints = $item['use_points'] ?? false;

                if ($usePoints && $product->points_cost) {
                    $pointsRequired = $product->points_cost * $item['quantity'];
                    $totalPointsRequired += $pointsRequired;
                    $subtotal = 0;
                } else {
                    $subtotal = $product->price * $item['quantity'];
                    $totalPrice += $subtotal;
                    $totalPointsEarned += $product->points_reward * $item['quantity'];
                }

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $usePoints ? 0 : $product->price,
                    'subtotal' => $subtotal,
                    'points_used' => $usePoints ? ($product->points_cost * $item['quantity']) : 0,
                ];
            }

            if ($totalPointsRequired > 0) {
                if ($request->user()->reward_points < $totalPointsRequired) {
                    DB::rollBack();

                    return response()->json(['message' => 'Insufficient reward points'], 400);
                }
            }

            if ($totalPrice > 0 && ! $request->hasFile('payment_proof')) {
                DB::rollBack();

                return response()->json(['message' => 'Payment proof is required for cash purchases'], 400);
            }

            $paymentProofPath = null;
            if ($request->hasFile('payment_proof')) {
                $paymentProofPath = $request->file('payment_proof')->store('payment-proofs', 'public');
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'payment_status' => $totalPrice > 0 ? 'pending' : 'paid',
                'payment_method' => $validated['payment_method'],
                'payment_proof' => $paymentProofPath,
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            if ($totalPointsRequired > 0) {
                $request->user()->deductRewardPoints(
                    $totalPointsRequired,
                    "Redeemed for order #{$order->id}",
                    $order->id
                );
            }

            DB::commit();

            return new OrderResource($order->load(['items.product', 'user']));
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Order failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Order $order)
    {
        if (! $request->user()->is_admin && $order->user_id !== $request->user()->id) {
            abort(403);
        }

        return new OrderResource($order->load(['items.product', 'user']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        if (! $request->user()->is_admin) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,processing,completed,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,failed',
        ]);

        $oldPaymentStatus = $order->payment_status;

        $order->update($validated);

        if (isset($validated['payment_status']) && $validated['payment_status'] === 'paid' && $oldPaymentStatus !== 'paid') {
            $totalPointsEarned = 0;

            foreach ($order->items as $item) {
                if ($item->points_used == 0) {
                    $totalPointsEarned += $item->product->points_reward * $item->quantity;
                }
            }

            if ($totalPointsEarned > 0) {
                $order->user->addRewardPoints(
                    $totalPointsEarned,
                    "Earned from order #{$order->id}",
                    $order->id
                );
            }
        }

        return new OrderResource($order->load(['items.product', 'user']));
    }
}
