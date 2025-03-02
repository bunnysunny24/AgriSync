module.exports = {
    networks: {
      development: {
        host: "127.0.0.1", // Ganache runs locally
        port: 7545, // Check Ganache for correct port
        network_id: "5777", // Match any network ID
      }
    },
    compilers: {
      solc: {
        version: "0.8.19" // Match your contract version
      }
    }
  };
  