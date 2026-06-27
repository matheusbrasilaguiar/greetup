import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService _api;

  UserModel? _user;
  String? _error;
  bool _loading = false;

  AuthProvider(this._api);

  UserModel? get user => _user;
  String? get error => _error;
  bool get loading => _loading;
  bool get isLoggedIn => _user != null;
  String? get operatorFunction => _user?.operatorFunction;

  Future<void> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final user = await _api.login(email, password);

      if (user.role != 'OPERADOR') {
        _error = 'Acesso não autorizado para este aplicativo.';
        _loading = false;
        notifyListeners();
        return;
      }

      _api.setToken(user.token);
      _user = user;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void logout() {
    _user = null;
    _error = null;
    notifyListeners();
  }
}
