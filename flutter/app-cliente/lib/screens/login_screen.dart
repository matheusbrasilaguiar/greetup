import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
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
    final ok = await auth.login(_emailCtrl.text.trim(), _passwordCtrl.text);
    if (ok && mounted) context.go('/tables');
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
                // ── Logo (topo, respira com padding generoso) ─────────
                const SizedBox(height: 64),
                Column(
                  children: [
                    SvgPicture.asset('assets/logos/arch.svg', width: 38, height: 38),
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
                      'CORPORATE HOSPITALITY',
                      style: GuType.caption.copyWith(
                        color: GuColors.bordeaux700,
                        letterSpacing: 2.5,
                      ),
                    ),
                  ],
                ),

                const Spacer(),

                // ── Formulário (margem lateral 24px) ──────────────────
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      GuInput(
                        label: 'E-mail corporativo',
                        hint: 'gerente@empresa.com',
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
                      const SizedBox(height: 4),
                      GuButton(
                        'Esqueci minha senha',
                        intent: GuButtonIntent.ghost,
                        small: true,
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),

                // ── Footer ────────────────────────────────────────────
                const SizedBox(height: 20),
                Text(
                  'GREETUP · CORPORATE HOSPITALITY · V1.0',
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
