class OrderItemModel {
  final String id;
  final String orderId;
  final String status;
  final String productName;
  final String productCategory;
  final int quantity;
  final String? observations;
  final String tableCode;
  final String? customerName;
  final DateTime createdAt;

  const OrderItemModel({
    required this.id,
    required this.orderId,
    required this.status,
    required this.productName,
    required this.productCategory,
    required this.quantity,
    required this.tableCode,
    required this.createdAt,
    this.observations,
    this.customerName,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    final order = json['order'] as Map<String, dynamic>;
    final session = order['session'] as Map<String, dynamic>? ?? {};
    final table = session['table'] as Map<String, dynamic>? ?? {};
    final customer = session['customer'] as Map<String, dynamic>?;
    final product = json['product'] as Map<String, dynamic>;

    return OrderItemModel(
      id: json['id'] as String,
      orderId: order['id'] as String,
      status: json['status'] as String,
      productName: product['name'] as String,
      productCategory: product['category'] as String,
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      observations: json['observations'] as String?,
      tableCode: table['code'] as String? ?? '?',
      customerName: customer?['name'] as String?,
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
    );
  }

  OrderItemModel copyWith({String? status}) {
    return OrderItemModel(
      id: id,
      orderId: orderId,
      status: status ?? this.status,
      productName: productName,
      productCategory: productCategory,
      quantity: quantity,
      observations: observations,
      tableCode: tableCode,
      customerName: customerName,
      createdAt: createdAt,
    );
  }
}
