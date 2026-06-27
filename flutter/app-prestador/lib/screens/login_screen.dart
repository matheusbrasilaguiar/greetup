import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';
import '../widgets/gu_button.dart';
import '../widgets/gu_input.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl    = TextEditingController();
  final _passwordCtrl = TextEditingController();

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final auth = context.read<AuthProvider>();
    await auth.login(_emailCtrl.text.trim(), _passwordCtrl.text);
    if (!mounted) return;
    if (auth.isLoggedIn) {
      final fn = auth.operatorFunction;
      if (fn == 'COZINHA') {
        context.go('/cozinha');
      } else if (fn == 'GARCOM') {
        context.go('/garcom');
      } else {
        context.go('/display');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: GuColors.cream50,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 64),
                Column(
                  children: [
                    _ArchIcon(),
                    const SizedBox(height: 14),
                    Text(
                      'GreetUp',
                      style: GuType.h1.copyWith(
                        fontSize: 34,
                        fontWeight: FontWeight.w500,
                        letterSpacing: -1.6,
                        color: GuColors.ink900,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'PRESTADOR · OPERAÇÃO',
                      style: GuType.caption.copyWith(
                        color: GuColors.bordeaux700,
                        letterSpacing: 2.5,
                      ),
                    ),
                  ],
                ),

                const Spacer(),

                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      GuInput(
                        label: 'E-mail operacional',
                        hint: 'operador@empresa.com',
                        controller: _emailCtrl,
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 14),
                      GuInput(
                        label: 'Senha',
                        controller: _passwordCtrl,
                        obscure: true,
                      ),

                      if (auth.error != null) ...[
                        const SizedBox(height: 12),
                        Text(
                          auth.error!,
                          style: GuType.caption.copyWith(
                            color: GuColors.danger,
                            letterSpacing: 0,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],

                      const SizedBox(height: 8),
                      GuButton(
                        'Entrar',
                        onPressed: auth.loading ? null : _submit,
                        loading: auth.loading,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),
                Text(
                  'GREETUP · PRESTADOR · V1.0',
                  style: GuType.caption.copyWith(
                    fontSize: 8.5,
                    color: GuColors.ink500,
                    letterSpacing: 2.0,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ArchIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(38, 38),
      painter: _ArchPainter(),
    );
  }
}

class _ArchPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final strokePaint = Paint()
      ..color = GuColors.ink900
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0
      ..strokeCap = StrokeCap.round;

    final fillPaint = Paint()
      ..color = GuColors.bordeaux700
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(size.width * 0.125, size.height)
      ..lineTo(size.width * 0.125, size.height * 0.458)
      ..arcToPoint(
        Offset(size.width * 0.875, size.height * 0.458),
        radius: Radius.circular(size.width * 0.375),
        clockwise: false,
      )
      ..lineTo(size.width * 0.875, size.height);

    canvas.drawPath(path, strokePaint);
    canvas.drawCircle(
      Offset(size.width * 0.5, size.height * 0.542),
      size.width * 0.1,
      fillPaint,
    );
  }

  @override
  bool shouldRepaint(_) => false;
}
