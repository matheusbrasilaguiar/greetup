import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/tables_screen.dart';
import 'screens/open_session_screen.dart';
import 'screens/menu_screen.dart';
import 'screens/confirm_order_screen.dart';
import 'screens/active_account_screen.dart';
import 'tokens/gu_theme.dart';

class GreetUpApp extends StatelessWidget {
  const GreetUpApp({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    final router = GoRouter(
      initialLocation: '/login',
      redirect: (context, state) {
        final loggedIn = auth.isLoggedIn;
        final onLogin = state.matchedLocation == '/login';
        if (!loggedIn && !onLogin) return '/login';
        if (loggedIn && onLogin) return '/tables';
        return null;
      },
      routes: [
        GoRoute(
          path: '/login',
          builder: (_, __) => const LoginScreen(),
        ),
        GoRoute(
          path: '/tables',
          builder: (_, __) => const TablesScreen(),
        ),
        GoRoute(
          path: '/tables/:tableId/open-session',
          builder: (_, state) => OpenSessionScreen(
            tableId: state.pathParameters['tableId']!,
          ),
        ),
        GoRoute(
          path: '/tables/:tableId/menu',
          builder: (_, state) => MenuScreen(
            tableId: state.pathParameters['tableId']!,
            sessionId: state.uri.queryParameters['sessionId']!,
          ),
        ),
        GoRoute(
          path: '/tables/:tableId/confirm',
          builder: (_, state) => ConfirmOrderScreen(
            tableId: state.pathParameters['tableId']!,
            sessionId: state.uri.queryParameters['sessionId']!,
          ),
        ),
        GoRoute(
          path: '/tables/:tableId/account',
          builder: (_, state) => ActiveAccountScreen(
            tableId: state.pathParameters['tableId']!,
            sessionId: state.uri.queryParameters['sessionId']!,
          ),
        ),
      ],
    );

    return MaterialApp.router(
      title: 'Greetup',
      theme: buildGuTheme(),
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
