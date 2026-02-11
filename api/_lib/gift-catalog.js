const GIFT_CATALOG = {
  gift_01: { label: 'Relógio para o noivo tentar ser pontual UMA vez na vida', amount: 330 },
  gift_02: { label: 'Make da noiva', amount: 320 },
  gift_03: { label: 'Vale paciência da noiva', amount: 400 },
  gift_04: { label: 'Camisa do Santos pro noivo ir ver o Neymar', amount: 450 },
  gift_05: { label: 'Lanche do noivo', amount: 220 },
  gift_06: { label: 'Vaquinha para o ar condicionado', amount: 480 },
  gift_07: { label: 'Ração das dogs (Lisa e Cristal)', amount: 280 },
  gift_08: { label: 'Kit sobrevivência do casamento', amount: 260 },
  gift_09: { label: 'Amigos para sempre', amount: 360 },
  gift_10: { label: '1 ano de cabelo do noivo', amount: 800 },
  gift_11: { label: 'Ursinho da máquina', amount: 240 },
  gift_12: { label: 'Pilhas do controle do ar', amount: 420 },
  gift_13: { label: 'Havaianas da noiva', amount: 340 },
  gift_14: { label: 'Camisa do Santos pro noivo ir ver o Neymar', amount: 450 },
  gift_15: { label: 'Roupa de cama premium', amount: 420 },
  gift_16: { label: 'Mobiliar a casa', amount: 1100 },
  gift_18: { label: 'Relógio de respeito do noivo', amount: 1200 },
  gift_19: { label: 'Primeira compra do mercado', amount: 800 },
  gift_20: { label: 'Almoço especial para os pombinhos', amount: 350 },
  gift_21: { label: 'Final de semana romântico', amount: 1150 },
  gift_22: { label: 'Camisa do Santos pro noivo ir ver o Neymar', amount: 450 },
  gift_23: { label: 'Jogo de cama premium', amount: 900 },
  gift_24: { label: 'Autocuidado da noiva', amount: 380 },
  gift_25: { label: 'Raspar o cabelo do noivo', amount: 5000 },
};

module.exports = {
  GIFT_CATALOG,
  isValidGiftName(giftName) {
    return Object.prototype.hasOwnProperty.call(GIFT_CATALOG, giftName);
  },
  getGiftById(giftId) {
    return GIFT_CATALOG[giftId] || null;
  },
};



