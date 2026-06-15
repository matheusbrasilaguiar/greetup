import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'app.dart';
import 'config.dart';
import 'services/api_service.dart';
import 'providers/auth_provider.dart';
import 'providers/tables_provider.dart';
import 'providers/session_provider.dart';
import 'providers/menu_provider.dart';
import 'providers/order_provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  ApiService().init(AppConfig.apiBaseUrl);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => TablesProvider()),
        ChangeNotifierProvider(create: (_) => SessionProvider()),
        ChangeNotifierProvider(create: (_) => MenuProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
      ],
      child: const GreetUpApp(),
    ),
  );
}
