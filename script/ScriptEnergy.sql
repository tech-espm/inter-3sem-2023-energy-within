CREATE DATABASE IF NOT EXISTS energy DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;
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

-- Média por dia
SELECT
c.id_eletrodomestico,
e.nome_eletrodomestico,
avg(c.consumo) consumo,
date(data) dia
FROM consumo c
INNER JOIN eletrodomestico e ON e.id_eletrodomestico = c.id_eletrodomestico
WHERE c.data between '2023-10-23 00:00:00' and '2023-10-24 23:59:59'
group by c.id_eletrodomestico, e.nome_eletrodomestico, dia;

-- Consumo total por hora e por dia
SELECT
c.id_eletrodomestico,
avg(c.consumo) consumo,
date(data) dia,
extract(HOUR from data) hora
FROM consumo c
WHERE c.data between '2023-10-23 00:00:00' and '2023-10-24 23:59:59'
group by c.id_eletrodomestico, dia, hora;

-- 5 maiores consumos de um dia
SELECT
c.id_eletrodomestico,
sum(c.consumo) consumo
FROM consumo c
WHERE c.data between '2023-10-24 00:00:00' and '2023-10-24 23:59:59'
group by c.id_eletrodomestico
order by consumo desc
limit 5;
