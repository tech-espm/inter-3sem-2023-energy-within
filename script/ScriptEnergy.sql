CREATE SCHEMA IF NOT EXISTS energy DEFAULT CHARACTER SET utf8 ;
USE energy;

CREATE TABLE IF NOT EXISTS eletrodomestico (
  id_eletrodomestico INT NOT NULL AUTO_INCREMENT,
  nome_eletrodomestico VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_eletrodomestico)
);

CREATE TABLE IF NOT EXISTS consumo (
  id_consumo BIGINT NOT NULL AUTO_INCREMENT,
  id_eletrodomestico INT NOT NULL,
  data DATETIME NOT NULL,
  consumo DOUBLE NOT NULL,
  PRIMARY KEY (id_consumo),
  INDEX id_eletrodomestico_ix (id_eletrodomestico, data),
  INDEX data_ix (data),
  CONSTRAINT id_eletrodomestico_fk FOREIGN KEY (id_eletrodomestico) REFERENCES eletrodomestico (id_eletrodomestico) ON DELETE NO ACTION ON UPDATE NO ACTION
);
