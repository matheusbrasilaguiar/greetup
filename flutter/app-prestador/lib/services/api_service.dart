import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../models/order_item_model.dart';
import '../models/user_model.dart';

class ApiService {
  final String _base = AppConfig.apiBaseUrl;
  String? _token;

  void setToken(String token) => _token = token;

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  Future<UserModel> login(String email, String password) async {
    final res = await http.post(
      Uri.parse('$_base/auth/login'),
      headers: _headers,
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (res.statusCode != 200) {
      final body = jsonDecode(res.body);
      throw Exception(body['message'] ?? 'Erro ao fazer login');
    }
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final token = data['token'] as String;
    return UserModel.fromJson(data['user'] as Map<String, dynamic>, token);
  }

  Future<List<OrderItemModel>> listItems({String? status}) async {
    final uri = Uri.parse('$_base/orders/items').replace(
      queryParameters: status != null ? {'status': status} : null,
    );
    final res = await http.get(uri, headers: _headers);
    if (res.statusCode != 200) throw Exception('Erro ao carregar itens');
    final list = jsonDecode(res.body) as List<dynamic>;
    return list.map((e) => OrderItemModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> updateItemStatus(String orderId, String itemId, String status) async {
    final res = await http.patch(
      Uri.parse('$_base/orders/$orderId/items/$itemId/status'),
      headers: _headers,
      body: jsonEncode({'status': status}),
    );
    if (res.statusCode != 200) throw Exception('Erro ao atualizar status');
  }
}
