class APIError extends Error {
  constructor(message, code, err) {
    // j'appelle le constructeur du parent
    super(message);

    // une erreur est-elle passée au constructeur ?
    if (err) {
      this.error = err;
    }

    this.code = code;
    this.date = new Date();
  }
}

module.exports = APIError;
