abstract final class AppConfig {
  static const apiBaseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://10.0.2.2:3000',
  );
  static const gatewayUrl = String.fromEnvironment(
    'GATEWAY_URL',
    defaultValue: 'http://10.0.2.2:3001',
  );
}
