class HashService {
  async hash(value) {
    throw new Error("HashService#hash not implemented");
  }

  async compare(value, hashed) {
    throw new Error("HashService#compare not implemented");
  }
}

module.exports = HashService;
