import 'package:flutter/material.dart';
import '../models/session_model.dart';
import '../models/customer_model.dart';
import '../services/api_service.dart';

class SessionProvider extends ChangeNotifier {
  SessionModel? _currentSession;
  List<CustomerModel> _customerResults = [];
  bool _loading = false;
  bool _searching = false;
  String? _error;

  SessionModel? get currentSession => _currentSession;
  List<CustomerModel> get customerResults => _customerResults;
  bool get loading => _loading;
  bool get searching => _searching;
  String? get error => _error;

  Future<void> searchCustomers(String q) async {
    if (q.trim().isEmpty) {
      _customerResults = [];
      notifyListeners();
      return;
    }

    _searching = true;
    notifyListeners();

    try {
      final response = await ApiService().dio.get('/customers', queryParameters: {'q': q});
      _customerResults = (response.data as List)
          .map((c) => CustomerModel.fromJson(c))
          .toList();
    } catch (_) {
      _customerResults = [];
    } finally {
      _searching = false;
      notifyListeners();
    }
  }

  Future<CustomerModel?> createCustomer(Map<String, dynamic> data) async {
    try {
      final response = await ApiService().dio.post('/customers', data: data);
      return CustomerModel.fromJson(response.data);
    } catch (_) {
      return null;
    }
  }

  Future<SessionModel?> openSession({
    required String tableId,
    required String attendantId,
    String? customerId,
  }) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService().dio.post(
        '/tables/$tableId/sessions',
        data: {
          'attendantId': attendantId,
          if (customerId != null) 'customerId': customerId,
        },
      );
      _currentSession = SessionModel.fromJson(response.data);
      return _currentSession;
    } catch (_) {
      _error = 'Não foi possível abrir a sessão.';
      return null;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<SessionModel?> loadActiveSession(String tableId) async {
    try {
      final response = await ApiService().dio.get('/tables/$tableId/sessions/active');
      _currentSession = SessionModel.fromJson(response.data);
      notifyListeners();
      return _currentSession;
    } catch (_) {
      return null;
    }
  }

  Future<bool> closeSession(String tableId, String sessionId) async {
    _loading = true;
    notifyListeners();

    try {
      await ApiService().dio.patch('/tables/$tableId/sessions/$sessionId/close');
      _currentSession = null;
      return true;
    } catch (_) {
      _error = 'Não foi possível encerrar a sessão.';
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void clearResults() {
    _customerResults = [];
    notifyListeners();
  }

  void clear() {
    _currentSession = null;
    _customerResults = [];
    _error = null;
    notifyListeners();
  }
}
