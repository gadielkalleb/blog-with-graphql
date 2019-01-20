import * as http from 'http';
import app from './app';
import db from './models';
import { normalizePort, onError, onListening } from './utils/utils';

const server = http.createServer(app);
const port = normalizePort(process.env.PORT || 3000)

// Isso é uma ajuda se por acaso seu banco mysql não estier funcionando. o password é oque vc usou para o usuario que vai acessa o mysql
// alter user 'root'@'localhost' identified with mysql_native_password by 'PASSWORD'

db.sequelize.sync({ force: true }).then(() => {
  server.listen(port);
  server.on('error', onError(server));
  server.on('listening', onListening(server));
})
