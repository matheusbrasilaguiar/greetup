import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  io.Socket? _socket;
  bool get isConnected => _socket?.connected ?? false;

  void connect(String gatewayUrl, String token) {
    if (isConnected) return;

    _socket = io.io(gatewayUrl, {
      'auth': {'token': token},
      'transports': ['websocket'],
      'autoConnect': true,
    });

    _socket!.onConnect((_) =>
        print('[Socket] Connected to gateway'));
    _socket!.onDisconnect((_) =>
        print('[Socket] Disconnected from gateway'));
    _socket!.onError((err) =>
        print('[Socket] Error: $err'));
  }

  void on(String event, Function(dynamic) handler) =>
      _socket?.on(event, handler);

  void off(String event) => _socket?.off(event);

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }
}
