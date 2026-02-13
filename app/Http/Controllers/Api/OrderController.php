<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
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
            ? Order::with('items.product')->latest()->get()
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
            'payment_method' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $totalPrice = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $product->price * $item['quantity'];
                $totalPrice += $subtotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $validated['payment_method'],
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item); // Or use createMany if optimized
            }

            DB::commit();

            return new OrderResource($order->load('items.product'));

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
        if (!$request->user()->is_admin && $order->user_id !== $request->user()->id) {
            abort(403);
        }

        return new OrderResource($order->load('items.product'));
    }
}
