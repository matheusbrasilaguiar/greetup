import 'customer_model.dart';
import 'order_model.dart';

class SessionModel {
  final String id;
  final String tableId;
  final String tableCode;
  final String? customerId;
  final CustomerModel? customer;
  final String attendantId;
  final String attendantName;
  final DateTime openedAt;
  final DateTime? closedAt;
  final int durationMinutes;
  final List<OrderModel> orders;

  const SessionModel({
    required this.id,
    required this.tableId,
    required this.tableCode,
    required this.attendantId,
    required this.attendantName,
    required this.openedAt,
    required this.durationMinutes,
    required this.orders,
    this.customerId,
    this.customer,
    this.closedAt,
  });

  bool get isActive => closedAt == null;

  factory SessionModel.fromJson(Map<String, dynamic> json) => SessionModel(
    id:              json['id'],
    tableId:         json['table']['id'],
    tableCode:       json['table']['code'],
    customerId:      json['customerId'],
    customer:        json['customer'] != null
        ? CustomerModel.fromJson(json['customer'])
        : null,
    attendantId:     json['attendant']['id'],
    attendantName:   json['attendant']['name'],
    openedAt:        DateTime.parse(json['openedAt']),
    closedAt:        json['closedAt'] != null ? DateTime.parse(json['closedAt']) : null,
    durationMinutes: json['durationMinutes'] ?? 0,
    orders:          (json['orders'] as List<dynamic>? ?? [])
                       .map((o) => OrderModel.fromJson(o))
                       .toList(),
  );
}
