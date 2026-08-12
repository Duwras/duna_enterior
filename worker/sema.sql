-- Az üzenetek tárolása. A weboldal statikus, ez az egyetlen hely, ahol
-- adat keletkezik — ezért a séma is szándékosan egyszerű.
CREATE TABLE IF NOT EXISTS uzenetek (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  mikor      TEXT NOT NULL,
  nev        TEXT NOT NULL,
  email      TEXT NOT NULL,
  telefon    TEXT NOT NULL,
  telepules  TEXT NOT NULL,
  uzenet     TEXT NOT NULL,
  pontszam   REAL,          -- reCAPTCHA v3 pontszám, 0 és 1 között
  ip         TEXT
);

CREATE INDEX IF NOT EXISTS uzenetek_mikor ON uzenetek (mikor DESC);
