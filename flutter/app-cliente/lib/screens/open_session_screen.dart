import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../models/customer_model.dart';
import '../providers/auth_provider.dart';
import '../providers/session_provider.dart';
import '../providers/tables_provider.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';
import '../widgets/gu_button.dart';
import '../widgets/gu_input.dart';

class OpenSessionScreen extends StatefulWidget {
  final String tableId;

  const OpenSessionScreen({
    super.key,
    required this.tableId,
  });

  @override
  State<OpenSessionScreen> createState() => _OpenSessionScreenState();
}

class _OpenSessionScreenState extends State<OpenSessionScreen> {
  final _searchCtrl   = TextEditingController();
  final _nameCtrl     = TextEditingController();
  final _employerCtrl = TextEditingController();
  final _emailCtrl    = TextEditingController();
  final _phoneCtrl    = TextEditingController();

  CustomerModel? _selected;

  @override
  void initState() {
    super.initState();
    _nameCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    _nameCtrl.dispose();
    _employerCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    context.read<SessionProvider>().clearResults();
    super.dispose();
  }

  bool get _canOpen {
    if (_selected != null) return true;
    return _nameCtrl.text.trim().isNotEmpty;
  }

  Future<void> _openSession() async {
    if (!_canOpen) return;

    final auth    = context.read<AuthProvider>();
    final session = context.read<SessionProvider>();

    String? customerId = _selected?.id;

    if (_selected == null && _nameCtrl.text.trim().isNotEmpty) {
      final newCustomer = await session.createCustomer({
        'name':     _nameCtrl.text.trim(),
        if (_employerCtrl.text.trim().isNotEmpty) 'employer': _employerCtrl.text.trim(),
        if (_emailCtrl.text.trim().isNotEmpty) 'email': _emailCtrl.text.trim(),
        if (_phoneCtrl.text.trim().isNotEmpty) 'phone': _phoneCtrl.text.trim(),
      });
      customerId = newCustomer?.id;
    }

    final result = await session.openSession(
      tableId: widget.tableId,
      attendantId: auth.user!.id,
      customerId: customerId,
    );

    if (result != null && mounted) {
      context.push('/tables/${widget.tableId}/menu?sessionId=${result.id}');
    }
  }

  @override
  Widget build(BuildContext context) {
    final session  = context.watch<SessionProvider>();
    final tables   = context.read<TablesProvider>();
    final tableCode = tables.tables
        .where((t) => t.id == widget.tableId)
        .map((t) => t.code)
        .firstOrNull ?? widget.tableId;

    return Scaffold(
      backgroundColor: GuColors.cream50,
      body: SafeArea(
        child: Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 560),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Header ───────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      _CircleBack(onTap: () => context.pop()),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'NOVA MESA',
                            style: GuType.caption.copyWith(
                              color: GuColors.bordeaux700,
                              letterSpacing: 1.6,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(tableCode, style: GuType.h2),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // ── Formulário scrollável ────────────────────────────
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        GuInput(
                          label: 'Cliente já cadastrado',
                          hint: 'Buscar por nome ou empresa…',
                          controller: _searchCtrl,
                          prefixIcon: Icons.search_outlined,
                          onChanged: (q) => session.searchCustomers(q),
                        ),

                        if (session.searching)
                          const Padding(
                            padding: EdgeInsets.only(top: 8),
                            child: LinearProgressIndicator(color: GuColors.bordeaux700),
                          ),

                        if (session.customerResults.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          ...session.customerResults.take(5).map(
                            (c) => _CustomerResultTile(
                              customer: c,
                              onTap: () {
                                setState(() => _selected = c);
                                _searchCtrl.clear();
                                session.clearResults();
                              },
                            ),
                          ),
                        ],

                        if (_selected != null) ...[
                          const SizedBox(height: 8),
                          _SelectedCustomerCard(
                            customer: _selected!,
                            onRemove: () => setState(() => _selected = null),
                          ),
                        ],

                        _DividerOu(),

                        GuInput(label: 'Nome completo *', controller: _nameCtrl),
                        const SizedBox(height: 14),
                        GuInput(label: 'Empresa *', controller: _employerCtrl),
                        const SizedBox(height: 14),
                        GuInput(label: 'Cargo', controller: TextEditingController()),
                        const SizedBox(height: 14),
                        GuInput(
                          label: 'E-mail',
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                        ),
                        const SizedBox(height: 14),
                        GuInput(
                          label: 'Telefone',
                          hint: '(11) 9 ····-····',
                          controller: _phoneCtrl,
                          keyboardType: TextInputType.phone,
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),

                // ── Botão fixo ───────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
                  child: GuButton(
                    'Abrir atendimento',
                    onPressed: (_canOpen && !session.loading) ? _openSession : null,
                    loading: session.loading,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Componentes internos ─────────────────────────────────────────────────────

class _CircleBack extends StatelessWidget {
  final VoidCallback onTap;
  const _CircleBack({required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      width: 32, height: 32,
      decoration: const BoxDecoration(
        color: GuColors.cream100,
        shape: BoxShape.circle,
      ),
      child: const Icon(Icons.chevron_left, size: 18, color: GuColors.ink900),
    ),
  );
}

class _DividerOu extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 14),
    child: Row(
      children: [
        const Expanded(child: Divider(color: GuColors.cream200, height: 1)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Text(
            'OU CADASTRAR NOVO',
            style: GuType.caption.copyWith(color: GuColors.ink500, letterSpacing: 1.3),
          ),
        ),
        const Expanded(child: Divider(color: GuColors.cream200, height: 1)),
      ],
    ),
  );
}

class _SelectedCustomerCard extends StatelessWidget {
  final CustomerModel customer;
  final VoidCallback onRemove;
  const _SelectedCustomerCard({required this.customer, required this.onRemove});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: const Color(0xFFFBEEF0),
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: GuColors.bordeaux300),
    ),
    child: Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(customer.name, style: GuType.h3.copyWith(fontSize: 14)),
              if (customer.employer != null)
                Text(customer.employer!, style: GuType.bodySm),
            ],
          ),
        ),
        GestureDetector(
          onTap: onRemove,
          child: const Icon(Icons.close, size: 16, color: GuColors.ink500),
        ),
      ],
    ),
  );
}

class _CustomerResultTile extends StatelessWidget {
  final CustomerModel customer;
  final VoidCallback onTap;
  const _CustomerResultTile({required this.customer, required this.onTap});

  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: GuColors.cream200)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(customer.name, style: GuType.h3.copyWith(fontSize: 13)),
                if (customer.employer != null)
                  Text(customer.employer!, style: GuType.caption.copyWith(letterSpacing: 0)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: GuColors.ink300, size: 16),
        ],
      ),
    ),
  );
}
