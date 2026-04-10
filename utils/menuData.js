const menuItems = [
  // Short_orders (R codes)
  {
    code: 'R1',
    name: 'Chopsuey',
    category: 'shortorder',
    price: 245.00,
    description: 'Good for 3-4 people',
    image: 'assets/img/short_orders/chopsuey.jpg'
  },
  {
    code: 'R2',
    name: 'Bam-e',
    category: 'shortorder',
    price: 225.00,
    description: 'Good for 3-4 people',
    image: 'assets/img/short_orders/bam-e.jpg'
  },
  {
    code: 'R3',
    name: 'Pancit Canton',
    category: 'shortorder',
    price: 225.00,
    description: 'Good for 3-4 people',
    image: 'assets/img/short_orders/pancitcanton.jpg'
  },
  {
    code: 'R4',
    name: 'Bihon Guisado',
    category: 'shortorder',
    price: 225.00,
    description: 'Good for 3-4 people',
    image: 'assets/img/short_orders/bihon.jpg'
  },
  {
    code: 'R5',
    name: 'Sotanghon Guisado',
    category: 'shortorder',
    price: 265.00,
    description: 'Good for 3-4 people',
    image: 'assets/img/short_orders/sotanghon.jpg'
  },
  //end of short orders
  {
    code: 'R6',
    name: 'Coke 12oz',
    category: 'drinks',
    price: 35.00,
    description: '',
    image: 'assets/img/drinks/coke12.jpg'
  },
  {
    code: 'R7',
    name: 'Royal 12oz',
    category: 'drinks',
    price: 35.00,
    description: '',
    image: 'assets/img/drinks/royal12.jpg'
  },
  {
    code: 'R8',
    name: 'Sprite 12oz',
    category: 'drinks',
    price: 35.00,
    description: '',
    image: 'assets/img/drinks/sprite12.jpg'
  },
  {
    code: 'R9',
    name: 'Coke 1ltr',
    category: 'drinks',
    price: 100.00,
    description: '',
    image: 'assets/img/drinks/coke1ltr.jpg'
  },
  {
    code: 'R10',
    name: 'Royal 1ltr',
    category: 'drinks',
    price: 100.00,
    description: '',
    image: 'assets/img/drinks/royal1ltr.jpg'
  },
  {
    code: 'N1',
    name: 'Sprite 1ltr',
    category: 'drinks',
    price: 100.00,
    description: '',
    image: 'assets/img/drinks/sprite1ltr.jpg'
  },
  {
    code: 'N2',
    name: 'Canned Coke',
    category: 'drinks',
    price: 99.00,
    description: '',
    image: 'assets/img/drinks/coke can.jpg'
  },
  {
    code: 'N3',
    name: 'Canned Royal',
    category: 'drinks',
    price: 99.00,
    description: '',
    image: 'assets/img/drinks/royal can.jpg'
  },
  {
    code: 'N4',
    name: 'Canned Sprite',
    category: 'drinks',
    price: 99.00,
    description: '',
    image: 'assets/img/drinks/sprite can.jpg'
  },
  {
    code: 'N5',
    name: 'Kopiko Lucky Day',
    category: 'drinks',
    price: 50.00,
    description: '',
    image: 'assets/img/drinks/kopik.jpg'
  },
  {
    code: 'N6',
    name: 'Dole Juice (in a can)',
    category: 'drinks',
    price: 70.00,
    description: '',
    image: 'assets/img/drinks/dole.jpg'
  },
  {
    code: 'N7',
    name: 'Bottled Water',
    category: 'drinks',
    price: 30.00,
    description: '',
    image: 'assets/img/drinks/water.jpg'
  },
  {
    code: 'N8',
    name: 'Sting',
    category: 'drinks',
    price: 30.00,
    description: '',
    image: 'assets/img/drinks/sting.jpeg'
  },
  {
    code: 'N9',
    name: 'Cobra',
    category: 'drinks',
    price: 30.00,
    description: '',
    image: 'assets/img/drinks/cobra.jpg'
  },
  // Beer (P codes)
  {
    code: 'B1',
    name: 'San Miguel Pilsen',
    category: 'beer',
    price: 95.00,
    image: 'assets/img/beer/1.png'
  },
  {
    code: 'B2',
    name: 'San Miguel Pilsen (5 Bottles)',
    category: 'beer',
    price: 450.00,
    image: 'assets/img/beer/1f.png'
  },
  {
    code: 'B3',
    name: 'San Mig Light',
    category: 'beer',
    price: 100.00,
    image: 'assets/img/beer/2.png'
  },
  {
    code: 'B4',
    name: 'San Mig Light (5 Bottles)',
    category: 'beer',
    price: 480.00,
    image: 'assets/img/beer/2f.png'
  },
  {
    code: 'B5',
    name: 'San Mig Apple',
    category: 'beer',
    price: 95.00,
    image: 'assets/img/beer/3.png'
  },
  {
    code: 'B6',
    name: 'San Mig Apple (5 Bottles)',
    category: 'beer',
    price: 450.00,
    image: 'assets/img/beer/3f.png'
  },
  {
    code: 'B7',
    name: 'San Mig Lemon',
    category: 'beer',
    price: 95.00,
    image: 'assets/img/beer/4.png'
  },
  {
    code: 'B8',
    name: 'San Mig Lemon (5 Bottles)',
    category: 'beer',
    price: 450.00,
    image: 'assets/img/beer/4f.png'
  },
  {
    code: 'B9',
    name: 'Red Horse Stallion',
    category: 'beer',
    price: 95.00,
    image: 'assets/img/beer/5.png'
  },
  {
    code: 'B10',
    name: 'Red Horse Stallion (5 Bottles)',
    category: 'beer',
    price: 450.00,
    image: 'assets/img/beer/5f.png'
  },
  {
    code: 'P1',
    name: 'Red Horse 500ml',
    category: 'beer',
    price: 110.00,
    image: 'assets/img/beer/6.png'
  },
  {
    code: 'P2',
    name: 'Red Horse 500ml (5 Bottles)',
    category: 'beer',
    price: 530.00,
    image: 'assets/img/beer/6f.png'
  },
  {
    code: 'P3',
    name: 'Smirnoff',
    category: 'beer',
    price: 110.00,
    image: 'assets/img/beer/7.png'
  },
  {
    code: 'P4',
    name: 'Smirnoff (5 Bottles)',
    category: 'beer',
    price: 530.00,
    image: 'assets/img/beer/7f.png'
  },
  {
    code: 'P5',
    name: 'Cerveza Negra',
    category: 'beer',
    price: 110.00,
    image: 'assets/img/beer/8.png'
  },
  {
    code: 'P6',
    name: 'Cerveza Negra (5 Bottles)',
    category: 'beer',
    price: 530.00,
    image: 'assets/img/beer/8f.png'
  },
  {
    code: 'P7',
    name: 'Cerveza Blanca',
    category: 'beer',
    price: 125.00,
    image: 'assets/img/beer/9.png'
  },
  {
    code: 'P8',
    name: 'Cerveza Blanca (5 Bottles)',
    category: 'beer',
    price: 600.00,
    image: 'assets/img/beer/9f.png'
  },
  {
    code: 'P9',
    name: 'SMB Super Dry',
    category: 'beer',
    price: 145.00,
    image: 'assets/img/beer/10.png'
  },
  {
    code: 'P10',
    name: 'SMB Super Dry (5 Bottles)',
    category: 'beer',
    price: 700.00,
    image: 'assets/img/beer/10f.png'
  },
  {
    code: 'D1',
    name: 'SMB Premium All-Malt',
    category: 'beer',
    price: 125.00,
    image: 'assets/img/beer/11.png'
  },
  {
    code: 'D2',
    name: 'SMB Premium All-Malt (5 Bottles)',
    category: 'beer',
    price: 600.00,
    image: 'assets/img/beer/11f.png'
  },
  {
    code: 'D3',
    name: 'Lechon Kawali',
    category: 'pork',
    price: 295.00,
    description:'Good for 2-3 people',
    image: 'assets/img/pork/lechon.jpg'
  },
  {
    code: 'D4',
    name: 'Lumpia Prito',
    category: 'pork',
    price: 235.00,
    description:'12 pieces',
    image: 'assets/img/pork/lumpia.jpg'
  },
  {
    code: 'D5',
    name: 'Crispy Pata (large)',
    category: 'pork',
    price: 795.00,
    description:'Good for 4-5 people',
    image: 'assets/img/pork/pata.jpg'
  },

];