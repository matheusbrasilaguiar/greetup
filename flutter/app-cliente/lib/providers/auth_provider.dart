import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';
import '../config.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _loading = false;
  String? _error;

  bool get isLoggedIn => _user != null;
  UserModel? get user => _user;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> tryRestoreSession() async {
    final token = await ApiService().getToken();
    if (token == null) return;
    // Token exists but we don't have user in memory — re-login required
    // (stateless JWT: decode payload locally if needed)
  }

  Future<bool> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService().dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      final token = response.data['token'] as String;
      final user = UserModel.fromJson(response.data['user']);

      if (user.role != 'GERENTE' && user.role != 'ADMIN') {
        _error = 'Acesso não autorizado para este aplicativo';
        _loading = false;
        notifyListeners();
        return false;
      }

      await ApiService().saveToken(token);
      _user = user;

      SocketService().connect(AppConfig.gatewayUrl, token);

      _loading = false;
      notifyListeners();
      return true;
    } on Exception catch (e) {
      _error = _parseError(e);
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await ApiService().deleteToken();
    SocketService().disconnect();
    _user = null;
    notifyListeners();
  }

  String _parseError(Exception e) {
    return 'Credenciais incorretas. Tente novamente.';
  }
}
