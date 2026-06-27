import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'app.dart';
import 'providers/auth_provider.dart';
import 'providers/items_provider.dart';
import 'services/api_service.dart';
import 'services/socket_service.dart';

void main() {
  runApp(const _Root());
}

class _Root extends StatelessWidget {
  const _Root();

  @override
  Widget build(BuildContext context) {
    final api = ApiService();
    final socket = SocketService();

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(api)),
        ChangeNotifierProvider(create: (_) => ItemsProvider(api, socket)),
      ],
      child: const GreetUpPrestadorApp(),
    );
  }
}
