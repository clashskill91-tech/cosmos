// Holat yozuvlari muallif bilgan oxirgi ma'lumot; har bir missiya sahifasida tekshiring. Jonli telemetriya ko'rsatilmaydi.
const N = 'https://science.nasa.gov/mission/'
export const missions = [
 { name:'Apollo 11', agency:'NASA', launch:'1969 yil 16 iyul', goal:'Oyga birinchi ekipajli qo\'nish (1969 yil 20 iyul).', status:'Yakunlangan (1969)', url:'https://www.nasa.gov/apollo/' },
 { name:'Voyager 1', agency:'NASA', launch:'1977 yil 5 sentabr', goal:'Yupiter va Saturnni o\'rganib, yulduzlararo fazoga chiqish.', status:'Yulduzlararo fazoda ishlamoqda (tekshiring)', url:N + 'voyager/' },
 { name:'Voyager 2', agency:'NASA', launch:'1977 yil 20 avgust', goal:'Uran va Neptunga yetib borgan yagona kosmik kema.', status:'Yulduzlararo fazoda ishlamoqda (tekshiring)', url:N + 'voyager/' },
 { name:'Hubble kosmik teleskopi', agency:'NASA / ESA', launch:'1990 yil 24 aprel', goal:'Past Yer orbitasidan ultrabinafsha, ko\'rinadigan va yaqin infraqizil kuzatuvlar.', status:'Ishlamoqda (tekshiring)', url:N + 'hubble-space-telescope/' },
 { name:'James Webb kosmik teleskopi', agency:'NASA / ESA / CSA', launch:'2021 yil 25 dekabr', goal:'Dastlabki galaktikalar, ekzosayyoralar va yulduz tug\'ilishini infraqizil nurda o\'rganish.', status:'Ishlamoqda (tekshiring)', url:N + 'webb/' },
 { name:'Curiosity (Mars Science Laboratory)', agency:'NASA', launch:'2011 yil 26 noyabr', goal:'Gale krateri bir paytlar yashash uchun yaroqli bo\'lganmi, shuni aniqlash.', status:'Marsda ishlamoqda (tekshiring)', url:N + 'msl-curiosity/' },
 { name:'Perseverance', agency:'NASA', launch:'2020 yil 30 iyul', goal:'Qadimgi hayot izlarini qidirish va namunalar to\'plash.', status:'Marsda ishlamoqda (tekshiring)', url:N + 'mars-2020-perseverance/' },
 { name:'Cassini–Huygens', agency:'NASA / ESA / ASI', launch:'1997 yil 15 oktabr', goal:'Saturn, uning halqalari va yo\'ldoshlarini o\'rganish; Huygens 2005 yilda Titanga qo\'ngan.', status:'Yakunlangan (2017 yil 15 sentabrda tugagan)', url:N + 'cassini/' },
 { name:'Juno', agency:'NASA', launch:'2011 yil 5 avgust', goal:'Yupiterning tortishish va magnit maydoni hamda atmosferasini xaritalash.', status:'Yupiter orbitasida (tekshiring)', url:N + 'juno/' },
 { name:'New Horizons', agency:'NASA', launch:'2006 yil 19 yanvar', goal:'Plutonga (2015) va Kuiper belbog\'iga birinchi uchish.', status:'Uzaytirilgan missiya (tekshiring)', url:N + 'new-horizons/' },
]
