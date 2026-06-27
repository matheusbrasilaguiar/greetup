import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/cozinha/kanban_screen.dart';
import 'screens/garcom/ready_items_screen.dart';
import 'screens/display/display_screen.dart';
import 'tokens/gu_colors.dart';

GoRouter buildRouter(AuthProvider auth) => GoRouter(
      initialLocation: '/login',
      refreshListenable: auth,
      redirect: (context, state) {
        if (!auth.isLoggedIn) return '/login';
        if (state.matchedLocation == '/login') {
          final fn = auth.operatorFunction;
          if (fn == 'COZINHA') return '/cozinha';
          if (fn == 'GARCOM') return '/garcom';
          return '/display';
        }
        return null;
      },
      routes: [
        GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
        GoRoute(path: '/cozinha', builder: (_, __) => const KanbanScreen()),
        GoRoute(path: '/garcom', builder: (_, __) => const ReadyItemsScreen()),
        GoRoute(path: '/display', builder: (_, __) => const DisplayScreen()),
      ],
    );

class GreetUpPrestadorApp extends StatelessWidget {
  const GreetUpPrestadorApp({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final router = buildRouter(auth);

    return MaterialApp.router(
      title: 'GreetUp · Prestador',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: GuColors.bordeaux700,
        useMaterial3: true,
        scaffoldBackgroundColor: GuColors.cream50,
        fontFamily: 'Sora',
      ),
      routerConfig: router,
    );
  }
}
