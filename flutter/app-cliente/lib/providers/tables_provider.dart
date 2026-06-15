import 'package:flutter/material.dart';
import '../models/table_model.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';

class TablesProvider extends ChangeNotifier {
  List<TableModel> _tables = [];
  bool _loading = false;
  String? _error;

  List<TableModel> get tables => _tables;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> loadTables() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService().dio.get('/tables');
      _tables = (response.data as List)
          .map((t) => TableModel.fromJson(t))
          .toList();
    } catch (_) {
      _error = 'Não foi possível carregar as mesas.';
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void listenToSessionEvents() {
    SocketService().on('table_session_opened', (_) => loadTables());
    SocketService().on('table_session_closed', (_) => loadTables());
  }

  void stopListening() {
    SocketService().off('table_session_opened');
    SocketService().off('table_session_closed');
  }
}
