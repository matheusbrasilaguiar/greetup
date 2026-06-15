class ActiveSessionSummary {
  final String id;
  final DateTime openedAt;
  final int durationMinutes;
  final String? customerName;
  final String attendantId;
  final String attendantName;
  final List<Map<String, dynamic>> orders;

  const ActiveSessionSummary({
    required this.id,
    required this.openedAt,
    required this.durationMinutes,
    required this.attendantId,
    required this.attendantName,
    required this.orders,
    this.customerName,
  });

  factory ActiveSessionSummary.fromJson(Map<String, dynamic> json) =>
      ActiveSessionSummary(
        id:              json['id'],
        openedAt:        DateTime.parse(json['openedAt']),
        durationMinutes: json['durationMinutes'] ?? 0,
        customerName:    json['customer']?['name'],
        attendantId:     json['attendant']['id'],
        attendantName:   json['attendant']['name'],
        orders:          List<Map<String, dynamic>>.from(json['orders'] ?? []),
      );
}

class TableModel {
  final String id;
  final String code;
  final String status;
  final ActiveSessionSummary? activeSession;

  const TableModel({
    required this.id,
    required this.code,
    required this.status,
    this.activeSession,
  });

  bool get isOccupied => status == 'OCCUPIED';
  bool get isOpen => status == 'OPEN';
  bool get isClosed => status == 'CLOSED';

  factory TableModel.fromJson(Map<String, dynamic> json) => TableModel(
    id:            json['id'],
    code:          json['code'],
    status:        json['status'],
    activeSession: json['activeSession'] != null
        ? ActiveSessionSummary.fromJson(json['activeSession'])
        : null,
  );
}
