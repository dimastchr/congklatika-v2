const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const KEY = 'congklatika.v1';
const SFX_KEY = 'congklatika.sfx';

const topics = [
  {id:'addition',name:'Penjumlahan',icon:'➕',tag:'Menggabungkan',desc:'Satukan dua kelompok benda.',lesson:'Penjumlahan berarti menggabungkan dua kelompok. Kita memakai tanda + untuk menjumlahkan. Yuk, hitung semua bijinya!',example:'Ada 6 biji di satu lubang dan 4 biji di lubang lain. Semuanya ada 6 + 4 = 10 biji.',tip:'Mulai dari angka yang lebih besar, lalu hitung maju.'},
  {id:'subtraction',name:'Pengurangan',icon:'➖',tag:'Mengambil sebagian',desc:'Cari tahu berapa yang masih ada.',lesson:'Pengurangan dipakai saat sebagian benda diambil atau dipindahkan. Kita memakai tanda − untuk mengurangi. Hitung biji yang masih tersisa, ya!',example:'Buji punya 9 biji. Buji memindahkan 4 biji ke lubang lain. Kini tersisa 9 − 4 = 5 biji.',tip:'Hitung mundur satu langkah setiap kali.'},
  {id:'multiplication',name:'Perkalian',icon:'✖️',tag:'Kelompok sama banyak',desc:'Penjumlahan berulang membantu kita menghitung lebih cepat.',lesson:'Perkalian membantu kita menghitung beberapa kelompok dengan isi yang sama banyak. Kita memakai tanda × untuk mengalikan.',example:'Ada 3 lubang. Setiap lubang berisi 4 biji. Jadi 4 + 4 + 4 sama dengan 3 × 4 = 12 biji.',tip:'Pastikan tiap kelompok isinya sama, lalu hitung jumlah semua kelompok.'},
  {id:'division',name:'Pembagian',icon:'➗',tag:'Berbagi rata',desc:'Bagikan benda sama banyak.',lesson:'Pembagian berarti membagi benda menjadi beberapa kelompok sama banyak. Setiap kelompok mendapat jumlah yang sama. Kita memakai tanda ÷ untuk membagi.',example:'12 biji dibagikan sama rata ke 3 lubang. Tiap lubang mendapat 12 ÷ 3 = 4 biji.',tip:'Bagikan satu biji ke setiap kelompok secara bergiliran sampai habis.'},
  {id:'fraction',name:'Pecahan',icon:'½',tag:'Bagian dari satu utuh',desc:'Lihat bagian yang sama besar.',lesson:'Pecahan menunjukkan bagian dari satu benda utuh. Pada ½, angka bawah menunjukkan jumlah semua bagian yang sama besar. Angka atas menunjukkan bagian yang kita ambil.',example:'Satu kue dipotong menjadi 4 bagian sama besar. Satu potong kue itu ditulis ¼.',tip:'Bagian-bagiannya harus sama besar supaya adil.'},
  {id:'number-pattern',name:'Pola bilangan',icon:'🔢',tag:'Urutan angka',desc:'Lihat urutan angka dan cari angka berikutnya.',lesson:'Pola bilangan adalah urutan angka yang mengikuti cara tertentu. Bandingkan satu angka dengan angka sesudahnya.',example:'Urutannya 1, 3, 5, … bertambah 2 setiap kali. Jadi, angka sesudah 5 adalah 7.',tip:'Bandingkan dua angka yang bersebelahan. Apakah angkanya selalu bertambah atau berkurang dengan jumlah yang sama?'}
];
const quizTopics=topics.filter(topic=>topic.id!=='number-pattern');
const playerCharacters=[{id:'buji',name:'Buji',emoji:'🧒'},{id:'bintang',name:'Bintang',emoji:'⭐'},{id:'kupu',name:'Kupu-kupu',emoji:'🦋'},{id:'tunas',name:'Tunas',emoji:'🌱'}];

const lessonGuides = {
  addition: [
    {concept:'Penjumlahan menyatukan dua kelompok. Tanda + berarti menambah. Tanda = berarti nilai di kiri dan kanan sama.',bridge:['Di lubang A ada 4 biji dan di lubang B ada 3 biji.','Satukan kedua kelompok. Mulai dari 4, lalu hitung maju sampai 7.','Jadi, 4 + 3 = 7.'],exampleTitle:'Contoh langkah demi langkah · gabungkan dua lubang',example:'Buji punya 4 biji dan menemukan 3 biji lagi. Berapa biji semuanya?',worked:['Mulai dengan 4 biji.','Tambahkan 3: hitung maju 5, 6, 7.','Jadi, 4 + 3 = 7 biji.'],summary:'Tambah berarti menggabungkan. Urutan kelompok boleh ditukar; jumlahnya tetap sama: 4 + 3 sama dengan 3 + 4.',congklak:'Bayangkan satu lubang berisi 4 biji dan lubang lain 3 biji. Hitung biji dari kedua lubang untuk mengetahui jumlah semuanya.'},
    {concept:'Bilangan dua angka punya puluhan dan satuan. Pecah bilangan agar lebih mudah dijumlahkan.',bridge:['Soal 27 + 18 berarti menggabungkan dua kelompok biji.','Pecah 18 menjadi 10 dan 8. Tambahkan puluhan dahulu, lalu satuan.','Tulis langkahnya memakai tanda + dan = agar mudah dicek.'],exampleTitle:'Contoh langkah demi langkah · puluhan dan satuan',example:'Hitung 27 + 18 dengan memecah 18 menjadi 10 dan 8.',worked:['27 + 10 = 37.','37 + 8 = 45.','Jadi, 27 + 18 = 45.'],summary:'Pisahkan puluhan dan satuan, lalu jumlahkan satu per satu. Periksa hasilnya lagi.',congklak:'Kelompokkan 10 biji sebagai satu puluhan, lalu sisakan biji satuan. Tambahkan tiap kelompok, lalu gabungkan hasilnya.'},
    {concept:'Jika jumlah satuan lebih dari 9, buat 1 puluhan dari 10 satuan. Jumlahnya tetap sama.',bridge:['Untuk 56 + 37, pecah 56 menjadi 50 dan 6. Pecah 37 menjadi 30 dan 7.','Hitung puluhan: 50 + 30 = 80. Hitung satuan: 6 + 7 = 13.','Pecah 13 menjadi 10 + 3, lalu gabungkan dengan 80.'],exampleTitle:'Contoh langkah demi langkah · mengelompokkan satuan',example:'Hitung 56 + 37 dengan menggabungkan puluhan dan satuan.',worked:['50 + 30 = 80 dan 6 + 7 = 13.','80 + 13 = 80 + 10 + 3 = 93.','Jadi, 56 + 37 = 93.'],summary:'Jumlahkan puluhan dan satuan. Jika satuan mencapai 10, kelompokkan 10 satuan menjadi 1 puluhan.',congklak:'Sepuluh biji dapat dikelompokkan sebagai satu puluhan. Gabungkan puluhan dan biji satuan agar lebih mudah dihitung.'}
  ],
  subtraction: [
    {concept:'Pengurangan membantu mencari sisa atau selisih. Tanda − berarti sebagian benda diambil.',bridge:['Mulai dengan 9 biji di satu lubang.','Pindahkan 4 biji ke lubang lain.','Hitung biji yang tertinggal: 5 biji.'],exampleTitle:'Contoh langkah demi langkah · mencari sisa',example:'Ada 9 biji. Sebanyak 4 biji dipindahkan. Berapa biji yang tersisa?',worked:['Mulai dari 9 biji.','Ambil 4 biji satu per satu.','Tersisa 5 biji, jadi 9 − 4 = 5.'],summary:'Mengurangi berarti mengambil sebagian atau mencari selisih. Hasilnya tidak lebih besar daripada jumlah awal.',congklak:'Pindahkan beberapa biji dari satu lubang, kemudian hitung biji yang masih tertinggal di lubang itu.'},
    {concept:'Kurangi bilangan dua angka satu per satu. Kurangi puluhan dahulu, lalu satuan.',bridge:['Untuk 42 − 17, pecah 17 menjadi 10 dan 7.','Kurangi 10 dari 42. Lalu kurangi 7 dari hasilnya.','Cek dengan penjumlahan. Jika hasilnya ditambah 17, kita kembali ke 42.'],exampleTitle:'Contoh langkah demi langkah · kurangi bertahap',example:'Hitung 42 − 17 dengan memecah 17 menjadi 10 dan 7.',worked:['42 − 10 = 32.','32 − 7 = 25.','Periksa: 25 + 17 = 42. Jadi, 42 − 17 = 25.'],summary:'Pecah angka yang dikurangi menjadi puluhan dan satuan. Kurangi satu bagian setiap kali.',congklak:'Pindahkan 10 biji dahulu, lalu 7 biji. Menghitung di papan membantu melihat sisa setiap langkah.'},
    {concept:'Jika angka satuan yang akan dikurangi lebih besar daripada satuan awal, tukar 1 puluhan menjadi 10 satuan.',bridge:['Pada 90 − 38, pecah 38 menjadi 30 dan 8.','Kurangi puluhan: 90 − 30 = 60. Dari 60, ambil 8 satuan.','Tukar 1 dari 6 puluhan menjadi 10 satuan. Sekarang ada 5 puluhan dan 10 satuan. Setelah 8 diambil, tersisa 52.'],exampleTitle:'Contoh langkah demi langkah · kurangi bertahap',example:'Hitung 90 − 38 dengan mengurangi puluhan lalu satuan.',worked:['90 − 30 = 60.','60 − 8 = 52. Tukar 1 puluhan menjadi 10 satuan agar langkah kedua lebih mudah.','Jadi, 90 − 38 = 52.'],summary:'Kurangi satu per satu. Jika satuan belum cukup, tukar 1 puluhan menjadi 10 satuan.',congklak:'Bayangkan 10 biji sebagai satu puluhan. Buka satu ikatan menjadi 10 biji satuan saat perlu mengambilnya.'}
  ],
  multiplication: [
    {concept:'Perkalian adalah penjumlahan berulang dari kelompok yang isinya sama. Tanda × dibaca “kali”.',bridge:['Buat 3 kelompok yang sama banyak.','Isi setiap kelompok dengan 4 biji.','Hitung 4 + 4 + 4, atau tulis 3 × 4.'],exampleTitle:'Contoh langkah demi langkah · kelompok sama banyak',example:'Ada 3 lubang, masing-masing berisi 4 biji. Berapa semuanya?',worked:['Kelompok pertama: 4 biji; kelompok kedua: 4 biji; kelompok ketiga: 4 biji.','4 + 4 + 4 = 12.','Jadi, 3 × 4 = 12 biji.'],summary:'Perkalian menghitung banyak kelompok dikali isi tiap kelompok.',congklak:'Perhatikan lubang-lubang yang berisi jumlah biji sama. Hitung semua kelompok tanpa melewatkan satu kelompok pun.'},
    {concept:'Perkalian dapat dihitung dengan hitung loncat. Delapan kelompok berisi 7 biji dapat dihitung dengan langkah 7.',bridge:['Ada 8 kelompok, setiap kelompok berisi 7 biji.','Hitung berurutan: 7, 14, 21, 28, 35, 42, 49, 56.','Jumlah 8 kelompok itu dapat ditulis 8 × 7 = 56.'],exampleTitle:'Contoh langkah demi langkah · hitung kelompok berulang',example:'Delapan lubang masing-masing berisi 7 biji. Berapa semua bijinya?',worked:['Hitung 7 untuk kelompok pertama.','Lanjutkan menghitung per 7 sampai kelompok kedelapan: hasilnya 56.','Jadi, 8 × 7 = 56 biji.'],summary:'Gunakan hitung loncat atau penjumlahan berulang. Jangan tertukar antara jumlah kelompok dan isi setiap kelompok.',congklak:'Setiap lubang adalah satu kelompok. Jumlah bijinya menunjukkan isi kelompok itu.'},
    {concept:'Jika kelompoknya banyak, pecah bilangannya menjadi puluhan dan satuan agar lebih mudah dikalikan.',bridge:['Soal 12 × 8 berarti ada 12 kelompok, setiap kelompok berisi 8 biji.','Pecah 12 menjadi 10 + 2. Hitung 10 × 8 dan 2 × 8 secara terpisah.','Jumlahkan kedua hasil untuk mengetahui jumlah semua biji.'],exampleTitle:'Contoh langkah demi langkah · pecah kelompok',example:'Hitung 12 × 8 dengan memisahkan 12 kelompok menjadi 10 dan 2.',worked:['10 × 8 = 80 dan 2 × 8 = 16.','80 + 16 = 96.','Jadi, 12 × 8 = 96 biji.'],summary:'Pecah salah satu angka menjadi bagian yang mudah dihitung. Lalu jumlahkan hasilnya.',congklak:'Bayangkan 10 lubang berisi 8 biji dan 2 lubang lagi berisi 8 biji. Kedua kelompok besar itu menunjukkan 12 × 8.'}
  ],
  division: [
    {concept:'Pembagian berarti membagi benda sama rata. Tanda ÷ berarti membagi menjadi beberapa kelompok.',bridge:['Siapkan 12 biji dan 3 lubang.','Bagikan satu biji ke setiap lubang bergiliran sampai habis.','Setiap lubang mendapat 4 biji, jadi 12 ÷ 3 = 4.'],exampleTitle:'Contoh langkah demi langkah · berbagi rata',example:'Dua belas biji dibagikan sama rata ke 3 lubang. Berapa isi setiap lubang?',worked:['Bagikan biji satu per satu secara bergiliran.','Setiap lubang mendapat 4 biji.','Jadi, 12 ÷ 3 = 4 biji per lubang.'],summary:'Dalam pembagian rata, setiap kelompok harus mendapat jumlah yang sama.',congklak:'Bagikan biji ke beberapa lubang secara bergiliran. Periksa agar semua lubang mendapat jumlah yang sama.'},
    {concept:'Pembagian berhubungan dengan perkalian. Tanyakan: berapa kelompok berisi angka pembagi yang dapat dibuat dari jumlah awal?',bridge:['Untuk 72 ÷ 8, cari banyak kelompok berisi 8 biji yang membentuk 72.','Hitung 8 × 9 = 72.','Maka 72 ÷ 8 = 9, karena 9 kelompok berisi 8 biji.'],exampleTitle:'Contoh langkah demi langkah · hubungkan dengan perkalian',example:'Bagikan 72 biji sama rata ke 8 lubang.',worked:['Cari berapa kali 8 menjadi 72.','8 × 9 = 72, jadi ada 9 biji di tiap lubang.','Jadi, 72 ÷ 8 = 9.'],summary:'Perkalian dapat membantu memeriksa pembagian. Jawaban pembagian × angka pembagi harus sama dengan jumlah awal.',congklak:'Susun 72 biji ke dalam 8 kelompok sama banyak. Perkalian membantu memeriksa apakah setiap lubang berisi 9 biji.'},
    {concept:'Pembagian dengan jumlah yang lebih besar tetap bisa dilakukan dengan mencari kelompok yang sama banyak.',bridge:['Pada 96 ÷ 12, ada 96 biji dan 12 lubang tujuan.','Bagi rata, atau cari angka yang jika dikalikan 12 hasilnya 96.','Karena 12 × 8 = 96, setiap lubang berisi 8 biji.'],exampleTitle:'Contoh langkah demi langkah · bagi ke banyak kelompok',example:'Bagikan 96 biji sama rata ke 12 lubang.',worked:['Gunakan hubungan 12 × 8 = 96.','Artinya, 12 kelompok masing-masing berisi 8 biji.','Jadi, 96 ÷ 12 = 8 biji per lubang.'],summary:'Periksa pembagian dengan perkalian. Semua kelompok harus berisi jumlah yang sama.',congklak:'Susun biji secara merata ke 12 lubang. Periksa isi tiap lubang agar semuanya sama, yaitu 8 biji.'}
  ],
  fraction: [
    {concept:'Pecahan menunjukkan bagian dari satu utuh. Bagian-bagiannya harus sama besar agar adil.',bridge:['Bayangkan satu utuh dibagi menjadi 4 bagian yang sama besar.','Ambil 1 bagian dari 4 bagian itu.','Tulis sebagai 1/4. Angka 4 menunjukkan jumlah semua bagian. Angka 1 menunjukkan bagian yang diambil.'],exampleTitle:'Contoh langkah demi langkah · satu bagian dari empat',example:'Satu kue dipotong menjadi 4 bagian sama besar. Bagaimana menulis satu potong?',worked:['Jumlah seluruh bagian sama besar adalah 4.','Bagian yang diambil ada 1.','Jadi, satu potong ditulis 1/4, dibaca satu per empat.'],summary:'Angka bawah menunjukkan jumlah semua bagian yang sama besar. Angka atas menunjukkan bagian yang dipilih.',congklak:'Empat lubang pada gambar mewakili empat bagian dengan ukuran sama. Satu bagian yang dipilih mewakili 1/4.'},
    {concept:'Pecahan yang berbeda bisa bernilai sama jika menunjukkan bagian yang sama besar.',bridge:['Empat bagian sama besar membentuk satu utuh.','Dua bagian dari empat ditulis 2/4.','Dua bagian dari empat sama dengan satu bagian dari dua. Jadi, 2/4 = 1/2.'],exampleTitle:'Contoh langkah demi langkah · pecahan senilai',example:'Dua dari empat bagian sama besar ditulis 2/4. Pecahan itu sama dengan berapa?',worked:['Kelompokkan 4 bagian menjadi 2 pasangan.','Dua bagian yang dipilih membentuk 1 dari 2 pasangan.','Jadi, 2/4 = 1/2.'],summary:'Pecahan senilai terlihat berbeda, tetapi menunjukkan bagian yang sama besar.',congklak:'Warnai dua dari empat bagian pada gambar. Kedua bagian itu menunjukkan setengah dari satu utuh.'},
    {concept:'Untuk menjumlahkan pecahan, ukuran bagiannya harus sama. Samakan angka bawahnya lebih dahulu.',bridge:['Pada 1/2 + 1/4, bayangkan satu utuh dibagi menjadi 4 bagian sama besar.','Setengah utuh sama dengan 2/4. Tambahkan 1/4 lagi.','Jumlahnya 3/4 karena 3 dari 4 bagian terpilih.'],exampleTitle:'Contoh langkah demi langkah · samakan ukuran bagian',example:'Hitung 1/2 + 1/4 dengan mengubah setengah menjadi bagian perempat.',worked:['1/2 = 2/4 karena setengah memuat dua bagian perempat.','2/4 + 1/4 = 3/4.','Jadi, 1/2 + 1/4 = 3/4.'],summary:'Samakan angka bawah lebih dahulu. Setelah ukuran bagian sama, jumlahkan bagian yang dipilih.',congklak:'Empat bagian sama besar membantu melihatnya: dua bagian menunjukkan 1/2, lalu satu bagian lagi membuat 3/4.'}
  ],
  'number-pattern': [
    {concept:'Pola bilangan mengikuti cara yang berulang. Selisih adalah beda antara dua angka. Kita bisa tahu bedanya dengan mengurangi.',bridge:['Lihat urutan 1, 3, 5 pada tiga lubang congklak.','Bandingkan dua angka yang bersebelahan: 3 − 1 = 2 dan 5 − 3 = 2.','Aturannya: tambahkan 2 setiap kali. Jadi, angka berikutnya 7.'],exampleTitle:'Contoh langkah demi langkah · pola tambah 2',example:'Lubang pertama berisi 1 biji, lubang kedua 3 biji, dan lubang ketiga 5 biji. Berapa isi lubang berikutnya?',worked:['1 ke 3 bertambah 2 biji.','3 ke 5 juga bertambah 2 biji.','Tambahkan 2 lagi: 5 + 2 = 7 biji.'],summary:'Bandingkan dua angka yang bersebelahan. Jika bedanya sama, lanjutkan dengan cara yang sama.',congklak:'Bayangkan jumlah biji di lubang bertambah dua setiap melangkah: 1, 3, 5, lalu 7.'},
    {concept:'Pola bisa bertambah dengan cara lain. Bandingkan dua angka yang bersebelahan.',bridge:['Urutannya 2, 5, 8.','Hitung perubahannya: 5 − 2 = 3 dan 8 − 5 = 3.','Aturannya tambah 3; angka berikutnya 8 + 3 = 11.'],exampleTitle:'Contoh langkah demi langkah · pola tambah 3',example:'Buji menyusun 2, 5, 8 biji di tiga lubang. Angka berapa yang mengisi lubang keempat?',worked:['Selisih 2 ke 5 adalah 3.','Selisih 5 ke 8 juga 3.','Lanjutkan dengan tambah 3: 8 + 3 = 11.'],summary:'Pola tidak selalu bertambah 2. Cari perubahan yang sama, lalu lanjutkan.',congklak:'Isi lubang bertambah tiga biji pada setiap langkah: 2, 5, 8, lalu 11.'},
    {concept:'Pola bisa dimulai dari angka yang lebih besar. Cari perubahan yang sama untuk menemukan angka berikutnya.',bridge:['Amati urutan 4, 9, 14.','Selisih 9 − 4 = 5 dan 14 − 9 = 5.','Aturannya tambah 5, jadi angka berikutnya 14 + 5 = 19.'],exampleTitle:'Contoh langkah demi langkah · pola tambah 5',example:'Urutan jumlah bijinya adalah 4, 9, 14, … Berapa angka selanjutnya?',worked:['Dari 4 ke 9 bertambah 5.','Dari 9 ke 14 bertambah 5 lagi.','Tambah 5 sekali lagi: 14 + 5 = 19.'],summary:'Beda yang tetap membantu kita menemukan angka berikutnya, meski angka awalnya besar.',congklak:'Bayangkan tiga lubang berisi 4, 9, dan 14 biji. Tambahkan 5 lagi untuk mendapatkan 19.'}
  ]
};

const quizBanks = {
  pre: {
    addition: [
      {cat:'addition',q:'Di lubang ada 4 biji. Buji menambah 3 biji. Berapa jumlahnya?',options:['6 biji','7 biji','8 biji'],answer:1},
      {cat:'addition',q:'8 + 5 = ...',options:['12','13','14'],answer:1}
    ],
    subtraction: [
      {cat:'subtraction',q:'Ada 9 biji. 4 biji dipindahkan. Berapa sisanya?',options:['4 biji','5 biji','6 biji'],answer:1},
      {cat:'subtraction',q:'23 − 8 = ...',options:['13','15','17'],answer:1}
    ],
    multiplication: [
      {cat:'multiplication',q:'Ada 3 lubang, masing-masing berisi 4 biji. Berapa semua bijinya?',options:['7','10','12'],answer:2},
      {cat:'multiplication',q:'9 × 8 = ...',options:['63','72','81'],answer:1}
    ],
    division: [
      {cat:'division',q:'12 biji dibagi rata ke 3 lubang. Tiap lubang mendapat ...',options:['3 biji','4 biji','5 biji'],answer:1},
      {cat:'division',q:'72 ÷ 8 = ...',options:['8','9','10'],answer:1}
    ],
    fraction: [
      {cat:'fraction',q:'Satu benda dibagi menjadi 4 bagian sama besar. Satu bagian ditulis ...',options:['¼','⅓','½'],answer:0},
      {cat:'fraction',q:'Pada pecahan ⅔, angka 3 menunjukkan ...',options:['Bagian yang diambil','Jumlah seluruh bagian sama besar','Jumlah benda utuh'],answer:1}
    ]
  },
  post: {
    addition: [
      {cat:'addition',q:'Ada 5 biji di satu lubang dan 4 biji lagi di lubang lain. Berapa semuanya?',options:['8 biji','9 biji','10 biji'],answer:1},
      {cat:'addition',q:'9 + 6 = ...',options:['14','15','16'],answer:1}
    ],
    subtraction: [
      {cat:'subtraction',q:'Buji punya 10 biji. 3 biji dipindahkan. Berapa yang tersisa?',options:['6 biji','7 biji','8 biji'],answer:1},
      {cat:'subtraction',q:'25 − 9 = ...',options:['14','16','17'],answer:1}
    ],
    multiplication: [
      {cat:'multiplication',q:'Ada 4 kelompok. Setiap kelompok berisi 3 biji. Berapa semuanya?',options:['7','12','14'],answer:1},
      {cat:'multiplication',q:'7 × 8 = ...',options:['54','56','64'],answer:1}
    ],
    division: [
      {cat:'division',q:'16 biji dibagikan sama rata ke 4 lubang. Tiap lubang mendapat ...',options:['3 biji','4 biji','5 biji'],answer:1},
      {cat:'division',q:'63 ÷ 7 = ...',options:['8','9','10'],answer:1}
    ],
    fraction: [
      {cat:'fraction',q:'Satu kue dipotong menjadi 3 bagian sama besar. Satu bagian ditulis ...',options:['⅓','½','⅔'],answer:0},
      {cat:'fraction',q:'Pada pecahan ¾, angka 4 menunjukkan ...',options:['Bagian yang diambil','Jumlah seluruh bagian sama besar','Jumlah kue'],answer:1}
    ]
  }
};
const quizExtras={
  pre:{
    addition:[{cat:'addition',q:'14 + 8 = ...',options:['20','22','24'],answer:1}],
    subtraction:[{cat:'subtraction',q:'31 − 6 = ...',options:['24','25','27'],answer:1}],
    multiplication:[{cat:'multiplication',q:'5 kelompok, masing-masing 3 biji. Berapa semuanya?',options:['8','15','20'],answer:1}],
    division:[{cat:'division',q:'18 biji dibagi rata ke 6 lubang. Tiap lubang mendapat ...',options:['2','3','4'],answer:1}],
    fraction:[{cat:'fraction',q:'Dua dari empat bagian sama besar ditulis ...',options:['¼','½','¾'],answer:1}]
  },
  post:{
    addition:[{cat:'addition',q:'38 + 24 = ...',options:['52','62','64'],answer:1}],
    subtraction:[{cat:'subtraction',q:'53 − 28 = ...',options:['25','35','31'],answer:0}],
    multiplication:[{cat:'multiplication',q:'6 × 9 = ...',options:['45','54','56'],answer:1}],
    division:[{cat:'division',q:'84 biji dibagi rata ke 7 lubang. Tiap lubang mendapat ...',options:['11','12','13'],answer:1}],
    fraction:[{cat:'fraction',q:'½ sama nilainya dengan ...',options:['2/3','2/4','3/4'],answer:1}]
  }
};
const quizReasons={
  addition:'Penjumlahan menggabungkan dua jumlah. Pisahkan puluhan dan satuan bila angkanya lebih besar.',
  subtraction:'Pengurangan mencari beda atau sisa. Kurangi bagian-bagian itu satu per satu.',
  multiplication:'Perkalian menghitung kelompok-kelompok yang jumlahnya sama dengan penjumlahan berulang.',
  division:'Pembagian sama rata memberi setiap kelompok jumlah yang sama.',
  fraction:'Pecahan menunjukkan bagian dari satu utuh. Bagian yang dibandingkan harus sama besar.'
};
function baseQuizQuestionsFor(kind='pre'){
  const normalized=kind==='post'?'post':'pre',bank=quizBanks[normalized];
  return quizTopics.flatMap(t=>[...bank[t.id],...quizExtras[normalized][t.id]].map(q=>({...q,why:quizReasons[t.id]})));
}
function quizQuestionsFor(kind=quiz.kind){
  if(quiz.kind===kind&&Array.isArray(quiz.questions)&&quiz.questions.length)return quiz.questions;
  return baseQuizQuestionsFor(kind);
}
function shuffled(list){const result=list.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
function createQuiz(kind){
  const bank=kind==='post'?'post':'pre';
  const selected=shuffled(quizTopics.flatMap(t=>shuffled([...quizBanks[bank][t.id],...quizExtras[bank][t.id]]).slice(0,2).map(q=>({...q,why:quizReasons[t.id]}))));
  const correctSlots=shuffled([0,0,0,1,1,1,2,2,2,1]);
  return selected.map((q,index)=>{
    const correct=q.options[q.answer],wrong=shuffled(q.options.filter((_,i)=>i!==q.answer)),answer=correctSlots[index],options=wrong.slice();options.splice(answer,0,correct);
    return {...q,options,answer};
  });
}

function makeOptions(correct, distractors){
  const correctStr=String(correct).trim();
  const unique=[];
  const seen=new Set([correctStr]);
  for(const d of (distractors||[])){
    const s=String(d).trim();
    if(s&&!seen.has(s)){seen.add(s);unique.push(s)}
  }
  let offset=1;
  while(unique.length<2){
    const num=Number(correctStr);
    let cand=!isNaN(num)?String(Math.max(0,num+(unique.length===0?2:-2))):`${correctStr}?`;
    if(seen.has(cand)){cand=String(Math.max(0,(!isNaN(num)?num:10)+offset*3));offset++}
    seen.add(cand);unique.push(cand);
  }
  const chosen=unique.slice(0,2);
  const answerIndex=Math.floor(Math.random()*3);
  const options=chosen.slice();
  options.splice(answerIndex,0,correctStr);
  return {options,answer:answerIndex};
}

function createTopicQuestion(topicId, level, index){
  let text='', correct='', distractors=[], data={}, hint='', explanation='';
  const i = Math.abs(index % 3);
  if(topicId==='addition'){
    if(level===1){
      const pairs=[[5,4],[6,3],[5,3]], [a,b]=pairs[i], sum=a+b;
      text=`${a} + ${b} = …`; correct=String(sum); distractors=[String(sum-1),String(sum+1),String(sum+2)];
      data={op:'add',a,b,result:sum};
      hint=`Mulai dari ${Math.max(a,b)}, lalu hitung maju ${Math.min(a,b)} langkah.`;
      explanation=`${a} + ${b} sama dengan ${sum}.`;
    }else if(level===2){
      const pairs=[[34,19],[25,16],[38,25]], [a,b]=pairs[i], sum=a+b;
      text=`${a} + ${b} = …`; correct=String(sum);
      const noCarry=String((Math.floor(a/10)+Math.floor(b/10))*10+((a%10+b%10)%10));
      distractors=[noCarry,String(sum-1),String(sum+10)];
      data={op:'add',a,b,result:sum};
      hint=`Pecah ${b} menjadi puluhan dan satuan. Tambah puluhannya dulu, lalu satuannya.`;
      explanation=`${a} + ${b} = ${sum}.`;
    }else{
      const pairs=[[48,35],[54,28],[47,36]], [a,b]=pairs[i], sum=a+b;
      text=`${a} + ${b} = …`; correct=String(sum);
      distractors=[String(sum-10),String(sum-1),String(sum+10)];
      data={op:'add',a,b,result:sum};
      hint=`Jumlahkan puluhannya dulu (${Math.floor(a/10)*10} + ${Math.floor(b/10)*10}), lalu jumlahkan satuannya.`;
      explanation=`${a} + ${b} = ${sum}.`;
    }
  }else if(topicId==='subtraction'){
    if(level===1){
      const pairs=[[8,3],[7,2],[9,5]], [a,b]=pairs[i], rem=a-b;
      text=`${a} − ${b} = …`; correct=String(rem); distractors=[String(rem+1),String(rem-1),String(a+b)];
      data={op:'sub',a,b,result:rem};
      hint=`Mulai dari ${a}, lalu hitung mundur ${b} langkah.`;
      explanation=`${a} − ${b} = ${rem}.`;
    }else if(level===2){
      const pairs=[[45,18],[38,15],[43,19]], [a,b]=pairs[i], rem=a-b;
      text=`${a} − ${b} = …`; correct=String(rem);
      const invertedUnits=String((Math.floor(a/10)-Math.floor(b/10))*10+Math.abs(a%10-b%10));
      distractors=[String(rem+10),invertedUnits,String(rem-1)];
      data={op:'sub',a,b,result:rem};
      hint=`Kurangi ${Math.floor(b/10)*10} lebih dulu, kemudian kurangi sisa satuannya.`;
      explanation=`${a} − ${b} = ${rem}.`;
    }else{
      const pairs=[[82,35],[75,28],[84,37]], [a,b]=pairs[i], rem=a-b;
      text=`${a} − ${b} = …`; correct=String(rem);
      distractors=[String(rem+10),String(rem-1),String(rem+2)];
      data={op:'sub',a,b,result:rem};
      hint=`Kurangi puluhan: ${a} − ${Math.floor(b/10)*10}. Tukar 1 puluhan jadi 10 satuan lalu kurangi satuannya.`;
      explanation=`${a} − ${b} = ${rem}.`;
    }
  }else if(topicId==='multiplication'){
    if(level===1){
      const pairs=[[2,5],[4,3],[3,5]], [a,b]=pairs[i], prod=a*b;
      text=`${a} × ${b} = …`; correct=String(prod); distractors=[String(a+b),String(prod-b),String(prod+b)];
      data={op:'mul',a,b,result:prod};
      hint=`Hitung penjumlahan berulang: ${Array(a).fill(b).join(' + ')}.`;
      explanation=`${a} × ${b} = ${prod}.`;
    }else if(level===2){
      const pairs=[[7,6],[6,8],[9,6]], [a,b]=pairs[i], prod=a*b;
      text=`${a} × ${b} = …`; correct=String(prod); distractors=[String(a+b),String(prod-b),String(prod+b)];
      data={op:'mul',a,b,result:prod};
      hint=`Gunakan hitung loncat ${b} sebanyak ${a} langkah.`;
      explanation=`${a} × ${b} = ${prod}.`;
    }else{
      const pairs=[[11,6],[12,6],[11,7]], [a,b]=pairs[i], prod=a*b;
      text=`${a} × ${b} = …`; correct=String(prod); distractors=[String(a+b),String(prod-10),String(prod+6)];
      data={op:'mul',a,b,result:prod};
      hint=`Pecah ${a} menjadi 10 dan ${a%10}. Hitung (10 × ${b}) + (${a%10} × ${b}).`;
      explanation=`${a} × ${b} = ${prod}.`;
    }
  }else if(topicId==='division'){
    if(level===1){
      const pairs=[[15,3],[16,4],[18,3]], [a,b]=pairs[i], quot=a/b;
      text=`${a} ÷ ${b} = …`; correct=String(quot); distractors=[String(quot-1),String(quot+1),String(a-b)];
      data={op:'div',a,b,result:quot};
      hint=`Bagikan ${a} biji ke ${b} kelompok secara bergiliran.`;
      explanation=`${a} ÷ ${b} = ${quot}.`;
    }else if(level===2){
      const pairs=[[56,7],[64,8],[54,6]], [a,b]=pairs[i], quot=a/b;
      text=`${a} ÷ ${b} = …`; correct=String(quot); distractors=[String(quot-1),String(quot+1),String(a-b)];
      data={op:'div',a,b,result:quot};
      hint=`Cari angka yang jika dikalikan ${b} hasilnya ${a}.`;
      explanation=`${a} ÷ ${b} = ${quot}.`;
    }else{
      const pairs=[[84,12],[72,12],[88,11]], [a,b]=pairs[i], quot=a/b;
      text=`${a} ÷ ${b} = …`; correct=String(quot); distractors=[String(quot-1),String(quot+1),String(quot+2)];
      data={op:'div',a,b,result:quot};
      hint=`Hubungkan dengan perkalian: berapa dikalikan ${b} yang menghasilkan ${a}?`;
      explanation=`${a} ÷ ${b} = ${quot}.`;
    }
  }else if(topicId==='fraction'){
    if(level===1){
      const items=[
        {text:'Satu dari 3 bagian sama besar ditulis …',correct:'⅓',distractors:['¼','½'],parts:3,selected:1,t:'1 dari 3 bagian',h:'Angka 1 di atas, angka 3 di bawah.'},
        {text:'Dua dari 3 bagian sama besar ditulis …',correct:'⅔',distractors:['⅓','½'],parts:3,selected:2,t:'2 dari 3 bagian',h:'Dua bagian yang diambil ditulis di atas: 2/3.'},
        {text:'Tiga dari 4 bagian sama besar ditulis …',correct:'¾',distractors:['¼','½'],parts:4,selected:3,t:'3 dari 4 bagian',h:'Tiga bagian terpilih dari empat bagian sama besar.'}
      ][i];
      text=items.text; correct=items.correct; distractors=items.distractors;
      data={op:'fraction',parts:items.parts,selected:items.selected,text:items.t};
      hint=items.h; explanation=items.text.replace(' …',` ${items.correct}.`);
    }else if(level===2){
      const items=[
        {text:'2 dari 6 bagian sama besar sama dengan …',correct:'⅓',distractors:['½','¼'],parts:6,selected:2,t:'2/6 = …',h:'2 dari 6 bagian senilai dengan 1 dari 3 bagian (⅓).'},
        {text:'3 dari 6 bagian sama besar sama dengan …',correct:'½',distractors:['⅓','⅔'],parts:6,selected:3,t:'3/6 = …',h:'Tiga dari enam bagian adalah separuh atau setengah.'},
        {text:'2 dari 8 bagian sama besar sama dengan …',correct:'¼',distractors:['½','⅓'],parts:8,selected:2,t:'2/8 = …',h:'Dua dari delapan bagian senilai dengan seperempat.'}
      ][i];
      text=items.text; correct=items.correct; distractors=items.distractors;
      data={op:'fraction',parts:items.parts,selected:items.selected,text:items.t};
      hint=items.h; explanation=items.text.replace(' …',` ${items.correct}.`);
    }else{
      const items=[
        {text:'¼ + 2/4 = …',correct:'¾',distractors:['2/4','3/8'],parts:4,selected:3,t:'1/4 + 2/4 = …',h:'Penyebut sudah sama (4), jumlahkan pembilangnya: 1 + 2 = 3.'},
        {text:'⅓ + ⅓ = …',correct:'⅔',distractors:['2/6','1'],parts:3,selected:2,t:'1/3 + 1/3 = …',h:'Penyebutnya tetap 3, jumlahkan pembilangnya: 1 + 1 = 2.'},
        {text:'2/5 + 1/5 = …',correct:'⅗',distractors:['3/10','⅘'],parts:5,selected:3,t:'2/5 + 1/5 = …',h:'Jumlahkan pembilang 2 + 1 = 3, penyebutnya tetap 5.'}
      ][i];
      text=items.text; correct=items.correct; distractors=items.distractors;
      data={op:'fraction',parts:items.parts,selected:items.selected,text:items.t};
      hint=items.h; explanation=items.text.replace(' …',` ${items.correct}.`);
    }
  }else if(topicId==='number-pattern'){
    if(level===1){
      const items=[
        {seq:[2,4,6],next:8,step:2,h:'Polanya bertambah 2: 6 + 2 = 8.'},
        {seq:[3,5,7],next:9,step:2,h:'Hitung bedanya: 5 − 3 = 2. Maka 7 + 2 = 9.'},
        {seq:[4,6,8],next:10,step:2,h:'Tambahkan 2 pada angka terakhir: 8 + 2 = 10.'}
      ][i];
      text=`${items.seq.join(', ')}, … Berapa angka berikutnya?`; correct=String(items.next);
      distractors=[String(items.next-1),String(items.next+1),String(items.next+2)];
      data={op:'pattern',seq:items.seq,step:items.step};
      hint=items.h; explanation=`Polanya selalu bertambah ${items.step}. Angka selanjutnya ${items.next}.`;
    }else if(level===2){
      const items=[
        {seq:[1,4,7],next:10,step:3,h:'Hitung bedanya: 4 − 1 = 3. Maka 7 + 3 = 10.'},
        {seq:[3,6,9],next:12,step:3,h:'Polanya bertambah 3: 9 + 3 = 12.'},
        {seq:[5,8,11],next:14,step:3,h:'Tambahkan 3 pada angka 11: 11 + 3 = 14.'}
      ][i];
      text=`${items.seq.join(', ')}, … Berapa angka berikutnya?`; correct=String(items.next);
      distractors=[String(items.next-1),String(items.next+1),String(items.next+2)];
      data={op:'pattern',seq:items.seq,step:items.step};
      hint=items.h; explanation=`Polanya selalu bertambah ${items.step}. Angka selanjutnya ${items.next}.`;
    }else{
      const items=[
        {seq:[2,7,12],next:17,step:5,h:'Beda setiap angka adalah 5: 7 − 2 = 5. Maka 12 + 5 = 17.'},
        {seq:[3,8,13],next:18,step:5,h:'Polanya bertambah 5: 13 + 5 = 18.'},
        {seq:[5,9,13],next:17,step:4,h:'Hitung bedanya: 9 − 5 = 4. Maka 13 + 4 = 17.'}
      ][i];
      text=`${items.seq.join(', ')}, … Berapa angka berikutnya?`; correct=String(items.next);
      distractors=[String(items.next-1),String(items.next+1),String(items.next+2)];
      data={op:'pattern',seq:items.seq,step:items.step};
      hint=items.h; explanation=`Polanya selalu bertambah ${items.step}. Angka selanjutnya ${items.next}.`;
    }
  }

  const {options, answer}=makeOptions(correct, distractors);
  return {text, options, answer, data, hint, explanation};
}

function getTopicChallengeSession(topicId, level){
  if(!state.topicProgress)state.topicProgress={1:{},2:{},3:{}};
  if(!state.topicProgress[level])state.topicProgress[level]={};
  let session=state.topicProgress[level][topicId];
  if(!session||!Array.isArray(session.questions)||session.questions.length!==3){
    const q0=createTopicQuestion(topicId, level, 0);
    const q1=createTopicQuestion(topicId, level, 1);
    const q2=createTopicQuestion(topicId, level, 2);
    session={
      questions:[q0,q1,q2],
      currentIndex:0,
      answers:[null,null,null],
      correctCount:0,
      passed:topicDone(level, topicId)
    };
    state.topicProgress[level][topicId]=session;
  }
  return session;
}

function resetTopicChallenge(topicId, level){
  if(!state.topicProgress)state.topicProgress={1:{},2:{},3:{}};
  if(!state.topicProgress[level])state.topicProgress[level]={};
  const q0=createTopicQuestion(topicId, level, 0);
  const q1=createTopicQuestion(topicId, level, 1);
  const q2=createTopicQuestion(topicId, level, 2);
  state.topicProgress[level][topicId]={
    questions:[q0,q1,q2],
    currentIndex:0,
    answers:[null,null,null],
    correctCount:0,
    passed:topicDone(level, topicId)
  };
  delete practiceAnswered[topicId];
}

function getCurrentChallenge(topicId, level){
  const session=getTopicChallengeSession(topicId, level);
  const idx=Math.min(2, Math.max(0, session.currentIndex||0));
  const q=session.questions[idx]||session.questions[0];
  const item=[q.text, q.options, q.answer];
  item.text=q.text;
  item.options=q.options;
  item.answer=q.answer;
  item.data=q.data;
  item.hint=q.hint;
  return item;
}

const levelChallenges = {
  get addition(){return [getCurrentChallenge('addition',1),getCurrentChallenge('addition',2),getCurrentChallenge('addition',3)]},
  get subtraction(){return [getCurrentChallenge('subtraction',1),getCurrentChallenge('subtraction',2),getCurrentChallenge('subtraction',3)]},
  get multiplication(){return [getCurrentChallenge('multiplication',1),getCurrentChallenge('multiplication',2),getCurrentChallenge('multiplication',3)]},
  get division(){return [getCurrentChallenge('division',1),getCurrentChallenge('division',2),getCurrentChallenge('division',3)]},
  get fraction(){return [getCurrentChallenge('fraction',1),getCurrentChallenge('fraction',2),getCurrentChallenge('fraction',3)]},
  get 'number-pattern'(){return [getCurrentChallenge('number-pattern',1),getCurrentChallenge('number-pattern',2),getCurrentChallenge('number-pattern',3)]}
};
const levelMissions=['Mulai dari hitungan sederhana','Coba strategi hitung yang lebih seru','Tantangan angka sampai 99'];
const challengeHints={
  get addition(){return [getCurrentChallenge('addition',1).hint,getCurrentChallenge('addition',2).hint,getCurrentChallenge('addition',3).hint]},
  get subtraction(){return [getCurrentChallenge('subtraction',1).hint,getCurrentChallenge('subtraction',2).hint,getCurrentChallenge('subtraction',3).hint]},
  get multiplication(){return [getCurrentChallenge('multiplication',1).hint,getCurrentChallenge('multiplication',2).hint,getCurrentChallenge('multiplication',3).hint]},
  get division(){return [getCurrentChallenge('division',1).hint,getCurrentChallenge('division',2).hint,getCurrentChallenge('division',3).hint]},
  get fraction(){return [getCurrentChallenge('fraction',1).hint,getCurrentChallenge('fraction',2).hint,getCurrentChallenge('fraction',3).hint]},
  get 'number-pattern'(){return [getCurrentChallenge('number-pattern',1).hint,getCurrentChallenge('number-pattern',2).hint,getCurrentChallenge('number-pattern',3).hint]}
};
const emptyLevelProgress=()=>({1:[],2:[],3:[]});
const defaultState={page:'home',name:'',profileSaved:false,character:'buji',accountUsername:'',accountAuthMethod:'',cloudUid:'',gamesPlayed:0,gamesWon:0,curriculumVersion:2,legacyUnlockedLevels:[],activeLevel:1,preScores:null,postScores:null,preAttempts:[],postAttempts:[],lastQuizAttempt:null,quizDraft:null,quizDrafts:{pre:null,post:null},levelProgress:emptyLevelProgress(),topicProgress:{1:{},2:{},3:{}},practice:{},game:null};
let storageWarningShown=false;
let storageRecoveryNotice=false;
let state=loadState();
let quiz=state.quizDraft?{kind:state.quizDraft.kind,index:state.quizDraft.index,answers:state.quizDraft.answers.slice(),questions:state.quizDraft.questions.slice(),baselineId:state.quizDraft.baselineId||null}:{kind:null,index:0,answers:[],questions:[],baselineId:null};
let visualModel={multiplication:{groups:3,seeds:4},division:{groups:3,total:12},fraction:{parts:4,selected:1}};
let practiceAnswered={};
let playMode='traditional';
let studyTopic='addition';
let studyRound=null;
let studyQuestion=null;
let studyFeedbackTimer=null;
let studyQuestionToken=0;
let pendingQuizLeavePage=null;
let modalKind='';
let modalFocusIntent=null;
let modalReturnFocus=null;
let profileDialogOpen=!state.profileSaved;
let profileDialogRequired=!state.profileSaved;
let profileDialogName=state.name||'';
let profileDialogCharacter=state.character||'buji';
let profileReturnFocus=null;
let resetDialogOpen=false;
let resetReturnFocus=null;
let loginTab='signin';
let loginUsername='';
let loginPin='';
let loginPinConfirm='';
let loginDisplayName='';
let loginCharacter='buji';
let loginPinVisible=false;
let loginBusy=false;
let loginError='';
let loginNeedsProviderSetup=false;
let cloudSession={ready:false,signedIn:false,uid:'',username:'',authMethod:''};
let cloudSyncTimer=null;
let cloudObserverAttached=false;
let music={on:false,ctx:null,timer:null,step:0};
let effects={on:loadEffectsPreference(),ctx:null,voices:new Set()};
let speechVoice=null;
let narrationRequest=0;
let narrationActive=false;
let focusRestoreKey=null;
let activeMoveSnapshot=null;
let moveGeneration=0;
let aiGeneration=0;
let musicMaster=null;

function reducedMotion(){return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false}
function motionBehavior(){return reducedMotion()?'auto':'smooth'}
function loadEffectsPreference(){try{return localStorage.getItem(SFX_KEY)!=='off'}catch(e){return true}}
function effectsIcon(){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/>${effects.on?'<path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>':'<path d="m16 9 5 6m0-6-5 6"/>'}</svg>`}
function effectsButton(full=false){return `<button class="sfx-toggle ${full?'ghost-button':'music-button'}" data-sfx-toggle ${full?'data-sfx-full="true"':''} aria-pressed="${effects.on}" aria-label="${effects.on?'Matikan':'Nyalakan'} efek suara">${effectsIcon()}<span>${full?`Efek suara: ${effects.on?'Aktif':'Nonaktif'}`:'Suara'}</span></button>`}
function updateEffectsControls(){
  $$('[data-sfx-toggle]').forEach(button=>{
    button.setAttribute('aria-pressed',String(effects.on));
    button.setAttribute('aria-label',`${effects.on?'Matikan':'Nyalakan'} efek suara`);
    button.title=`Efek suara ${effects.on?'aktif':'nonaktif'} · terpisah dari musik`;
    button.innerHTML=effectsIcon()+`<span>${button.dataset.sfxFull?`Efek suara: ${effects.on?'Aktif':'Nonaktif'}`:'Suara'}</span>`;
  });
}
function primeEffects(){
  if(!effects.on)return false;
  try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return false;if(!effects.ctx)effects.ctx=new AudioCtx();effects.ctx.resume().catch(()=>{});return true}catch(e){return false}
}
function toggleEffects(){
  effects.on=!effects.on;
  if(effects.on&&!primeEffects()){effects.on=false;toast('Efek suara tidak tersedia di browser ini.');}
  if(!effects.on){effects.voices.forEach(voice=>{try{voice.stop()}catch(e){}});effects.voices.clear();}
  try{localStorage.setItem(SFX_KEY,effects.on?'on':'off')}catch(e){}
  updateEffectsControls();
  if(effects.on)playEffect('click');
}

function cleanUndoStack(value){if(!Array.isArray(value))return [];return value.slice(-40).filter(item=>item&&Array.isArray(item.pits)&&item.pits.length===16&&item.pits.every(n=>Number.isInteger(n)&&n>=0)&&item.pits.reduce((a,b)=>a+b,0)===98&&[0,1].includes(item.turn)).map(item=>({pits:item.pits.slice(),turn:item.turn,over:Boolean(item.over),message:String(item.message||'')}))}
function validPage(page){return ['home','beranda','learn','quiz','quiz-result','play','history','report','team','profile','login'].includes(page)}
function cleanScores(value){
  if(!value||typeof value!=='object'||!Number.isInteger(value.total)||value.total<0||value.total>10)return null;
  const scores={total:value.total};let correctSum=0;
  for(const topic of quizTopics){
    const raw=value[topic.id];let correct;
    if(raw&&typeof raw==='object'&&Number.isInteger(raw.correct)&&raw.correct>=0&&raw.correct<=2)correct=raw.correct;
    else if(Number.isInteger(raw)&&raw>=0&&raw<=100)correct=raw>2?Math.max(0,Math.min(2,Math.round(raw/50))):raw;
    else return null;
    scores[topic.id]={correct,total:2};correctSum+=correct;
  }
  return correctSum===value.total?scores:null;
}
function cleanQuestion(q){
  if(!q||!quizTopics.some(t=>t.id===q.cat)||typeof q.q!=='string'||!Array.isArray(q.options)||q.options.length<2||q.options.length>5||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)return null;
  return {cat:q.cat,q:q.q.slice(0,400),options:q.options.map(x=>String(x).slice(0,160)),answer:q.answer,why:String(q.why||quizReasons[q.cat]).slice(0,400)};
}
function cleanAttempt(value,kind){
  if(!value||value.kind!==kind)return null;const scores=cleanScores(value.scores);if(!scores)return null;
  const questions=Array.isArray(value.questions)?value.questions.map(cleanQuestion).filter(Boolean):[];
  const answers=Array.isArray(value.answers)?value.answers.slice(0,questions.length).map(a=>Number.isInteger(a)&&a>=0&&a<5?a:null):[];
  return {id:String(value.id||Date.now()).slice(0,48),kind,at:String(value.at||'').slice(0,40),scores,questions,answers,baselineId:value.baselineId?String(value.baselineId).slice(0,48):null};
}
function cleanDraft(value){
  if(!value||!['pre','post'].includes(value.kind)||!Array.isArray(value.questions)||value.questions.length!==10)return null;
  const questions=value.questions.map(cleanQuestion);if(questions.some(q=>!q))return null;
  const answers=Array.isArray(value.answers)?value.answers.slice(0,10).map((a,i)=>Number.isInteger(a)&&a>=0&&a<questions[i].options.length?a:null):Array(10).fill(null);
  while(answers.length<10)answers.push(null);
  return {kind:value.kind,index:Math.max(0,Math.min(9,Math.trunc(Number(value.index)||0))),questions,answers,baselineId:value.kind==='post'&&typeof value.baselineId==='string'?value.baselineId.slice(0,48):null};
}
function loadState(){
  try{
    const raw=localStorage.getItem(KEY),saved=raw?JSON.parse(raw):{};
    if(!saved||typeof saved!=='object'||Array.isArray(saved))throw new Error('Format data tidak sesuai');
    const next={...defaultState,...saved};
    next.name=typeof saved.name==='string'?saved.name.trim().slice(0,24):'';
    next.profileSaved=Boolean(next.name);
    next.character=playerCharacters.some(character=>character.id===saved.character)?saved.character:'buji';next.practice={};
    next.accountUsername=typeof saved.accountUsername==='string'?saved.accountUsername.trim().toLowerCase().slice(0,20):'';
    next.accountAuthMethod=['username_pin','google'].includes(saved.accountAuthMethod)?saved.accountAuthMethod:'';
    next.cloudUid=typeof saved.cloudUid==='string'?saved.cloudUid.slice(0,128):'';
    next.gamesPlayed=Math.max(0,Math.trunc(Number(saved.gamesPlayed)||0));
    next.gamesWon=Math.min(next.gamesPlayed,Math.max(0,Math.trunc(Number(saved.gamesWon)||0)));
    next.activeTopic=topics.some(t=>t.id===saved.activeTopic)?saved.activeTopic:null;
    if(!saved.levelProgress){
      const oldDone=Object.keys(saved.learned||{}).filter(id=>saved.learned[id]);
      next.levelProgress=emptyLevelProgress();next.levelProgress[1]=oldDone;next.activeLevel=1;
    }else{
      next.levelProgress={...emptyLevelProgress(),...saved.levelProgress};
      next.activeLevel=Math.min(3,Math.max(1,Math.trunc(Number(saved.activeLevel)||1)));
    }
    const allowed=new Set(topics.map(t=>t.id)),clean=emptyLevelProgress();
    for(const level of [1,2,3]){
      const rawLevel=next.levelProgress[level];
      clean[level]=Array.isArray(rawLevel)?[...new Set(rawLevel.filter(id=>allowed.has(id)))]:[];
    }
    next.levelProgress=clean;
    next.legacyUnlockedLevels=Array.isArray(saved.legacyUnlockedLevels)?[...new Set(saved.legacyUnlockedLevels.filter(level=>[2,3].includes(level)))]:[];
    if(saved.curriculumVersion!==2){
      const legacyDone=level=>quizTopics.every(topic=>clean[level].includes(topic.id));
      if(legacyDone(1))next.legacyUnlockedLevels.push(2);
      if(legacyDone(1)&&legacyDone(2))next.legacyUnlockedLevels.push(3);
      next.legacyUnlockedLevels=[...new Set(next.legacyUnlockedLevels)];
    }
    next.curriculumVersion=2;
    const fullyDone=level=>topics.every(topic=>clean[level].includes(topic.id));
    const highest=(fullyDone(1)||next.legacyUnlockedLevels.includes(2))?(fullyDone(2)||next.legacyUnlockedLevels.includes(3)?3:2):1;
    next.activeLevel=Math.min(next.activeLevel,highest);
    next.preScores=cleanScores(saved.preScores);next.postScores=cleanScores(saved.postScores);
    next.preAttempts=(Array.isArray(saved.preAttempts)?saved.preAttempts.map(x=>cleanAttempt(x,'pre')).filter(Boolean):[]).slice(-50);
    next.postAttempts=(Array.isArray(saved.postAttempts)?saved.postAttempts.map(x=>cleanAttempt(x,'post')).filter(Boolean):[]).slice(-50);
    if(next.preScores&&!next.preAttempts.length)next.preAttempts.push({id:'legacy-pre',kind:'pre',at:'',scores:next.preScores,questions:[],answers:[],baselineId:null});
    // Versi lama mewajibkan pretest sebelum posttest dan menghapus posttest saat pretest diulang; pasangan skor legacy yang tersisa karenanya berurutan.
    if(next.postScores&&!next.postAttempts.length)next.postAttempts.push({id:'legacy-post',kind:'post',at:'',scores:next.postScores,questions:[],answers:[],baselineId:next.preScores?next.preAttempts.at(-1)?.id||null:null});
    next.lastQuizAttempt=cleanAttempt(saved.lastQuizAttempt,saved.lastQuizAttempt?.kind)||null;
    const activeDraft=cleanDraft(saved.quizDraft),storedDrafts=saved.quizDrafts&&typeof saved.quizDrafts==='object'&&!Array.isArray(saved.quizDrafts)?saved.quizDrafts:{};
    next.quizDrafts={pre:cleanDraft(storedDrafts.pre),post:cleanDraft(storedDrafts.post)};
    if(activeDraft)next.quizDrafts[activeDraft.kind]=activeDraft;
    next.quizDraft=activeDraft;
    next.resultKind=['pre','post'].includes(saved.resultKind)?saved.resultKind:null;
    const g=saved.game;
    next.game=g&&Array.isArray(g.pits)&&g.pits.length===16&&g.pits.every(n=>Number.isInteger(n)&&n>=0)&&g.pits.reduce((a,b)=>a+b,0)===98&&[0,1].includes(g.turn)?{...g,mode:g.mode==='ai'?'ai':'two',animating:false,aiThinking:false,undoStack:cleanUndoStack(g.undoStack)}:null;
    delete next.grade;delete next.gradeDone;delete next.learned;
    next.topicProgress=saved.topicProgress&&typeof saved.topicProgress==='object'?saved.topicProgress:{1:{},2:{},3:{}};
    for(const lvl of [1,2,3]){if(!next.topicProgress[lvl])next.topicProgress[lvl]={};}
    const rawRoute=(window.location?.hash||'').slice(1);
    const route=rawRoute==='beranda'?'home':rawRoute;
    const savedRoute=saved.page==='beranda'?'home':saved.page;
    if(validPage(route))next.page=route==='beranda'?'home':route;
    else if(validPage(savedRoute))next.page=savedRoute==='beranda'?'home':savedRoute;
    if(next.quizDraft){next.page='quiz';}
    if(!next.profileSaved&&next.page==='profile')next.page='home';
    if(next.page==='quiz'&&!next.quizDraft)next.page='home';
    const currentResultScores=next.resultKind==='pre'?next.preScores:next.resultKind==='post'?next.postScores:(next.preScores||next.postScores);
    if(next.page==='quiz-result'&&!currentResultScores)next.page='home';
    return next;
  }catch(e){storageRecoveryNotice=true;return {...defaultState,levelProgress:emptyLevelProgress(),topicProgress:{1:{},2:{},3:{}}}}
}
function persistedSnapshot(){
  const snapshot={...state};
  if(state.game?.animating&&activeMoveSnapshot)snapshot.game={...activeMoveSnapshot,animating:false,aiThinking:false};
  else if(state.game?.aiThinking)snapshot.game={...state.game,animating:false,aiThinking:false};
  return snapshot;
}
function storageWarning(){if(storageWarningShown)return;storageWarningShown=true;setTimeout(()=>toast('Data tidak bisa disimpan karena penyimpanan perangkat tidak tersedia atau penuh. Kamu tetap bisa belajar, tetapi perubahan mungkin tidak tersimpan.'),0)}
function scheduleCloudSync(){
  if(!cloudSession.signedIn||!window.congklatikaCloud?.syncProgressToCloud)return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer=setTimeout(()=>{
    window.congklatikaCloud?.syncProgressToCloud?.(state)?.catch?.(err=>console.warn('Cloud sync deferred:',err));
  },650);
}
function save(){
  try{localStorage.setItem(KEY,JSON.stringify(persistedSnapshot()));updateHeader();scheduleCloudSync();return true}
  catch(e){storageWarning();updateHeader();return false}
}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function currentTopic(){return topics.find(t=>t.id===state.activeTopic)||topics[0]}
function topicDone(level,id){return (state.levelProgress[level]||[]).includes(id)}
function levelDone(level){return topics.every(t=>topicDone(level,t.id))}
function levelUnlocked(level){return level===1||state.legacyUnlockedLevels.includes(level)||levelDone(level-1)}
function allLevelsDone(){return [1,2,3].every(levelDone)}
function bottomRouteForPage(){if(state.page==='home')return'home';if(state.page==='learn')return'learn';if(state.page==='play')return'play';if(state.page==='quiz'||state.page==='quiz-result')return'quiz';if(state.page==='history'||state.page==='report')return'info';return null}
function updateHeader(){const av=$('#header-avatar'),avBtn=av?.closest('.avatar-button'),lb=$('#login-button'),character=playerCharacters.find(item=>item.id===state.character)||playerCharacters[0];if(av){av.textContent=character.emoji;av.setAttribute('aria-label',`${state.name?state.name+' · ':''}${character.name}`)}if(avBtn){avBtn.setAttribute('aria-label',`Profil pemain: ${state.name?state.name+' · ':''}${character.name}`)}if(lb){lb.textContent=cloudSession.signedIn?'Akun ✓':'Masuk';lb.setAttribute('aria-label',cloudSession.signedIn?`Akun cloud ${cloudSession.username||state.name}`:'Masuk dengan Username dan PIN')}$$('.nav-link').forEach(x=>{x.classList.toggle('active',x.dataset.page===state.page);if(x.dataset.page===state.page)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')});const active=bottomRouteForPage();$$('[data-bottom-route]').forEach(button=>{const selected=button.dataset.bottomRoute===active;button.classList.toggle('active',selected);if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});updateEffectsControls()}
function draftFor(kind){return state.quizDrafts?.[kind]||(state.quizDraft?.kind===kind?state.quizDraft:null)}
function hasQuizDraft(){return state.page==='quiz'&&!!state.quizDraft}
function commitPage(page,push=true){
  if(page==='beranda')page='home';
  if(page==='quiz'&&!state.quizDraft)page='home';
  if(page==='quiz-result'&&!(state.resultKind==='pre'?state.preScores:state.resultKind==='post'?state.postScores:(state.preScores||state.postScores)))page=state.preScores||state.postScores?'report':'home';
  if(state.page!==page){
    if(state.game?.animating)cancelInFlightMove();
    if(state.game?.aiThinking){aiGeneration++;state.game.aiThinking=false;state.game.message='Giliran Buji siap dilanjutkan saat papan dibuka kembali.';save()}
    else aiGeneration++;
    stopNarration();
  }
  if(page==='learn')state.activeTopic=null;
  state.page=page;
  if(push&&window.history?.pushState)window.history.pushState({congklatika:true,page},'',`#${page}`);
  else if(!push&&window.history?.replaceState)window.history.replaceState({congklatika:true,page},'',`#${page}`);
  save();render();window.scrollTo({top:0,behavior:motionBehavior()});$('#main-nav')?.classList.remove('open');$('#menu-toggle')?.setAttribute('aria-expanded','false');
  if(page==='play'&&state.game?.mode==='ai'&&state.game.turn===1&&!state.game.over){const aiReq=++aiGeneration;setTimeout(()=>{if(aiReq===aiGeneration)runAiTurn()},250)}
}
function showQuizLeaveDialog(page){pendingQuizLeavePage=page;modalReturnFocus=document.activeElement;renderActiveModal(true)}
function cancelQuizLeave(){pendingQuizLeavePage=null;renderActiveModal();const focus=modalReturnFocus;modalReturnFocus=null;if(focus?.isConnected)focus.focus({preventScroll:true})}
function leaveQuiz(){const page=pendingQuizLeavePage;if(!page)return;saveQuizDraft();pendingQuizLeavePage=null;modalReturnFocus=null;commitPage(page,false)}
function setPage(page){
  if(page==='beranda')page='home';
  if(!validPage(page))page='home';
  if(hasQuizDraft()&&page!=='quiz'){showQuizLeaveDialog(page);return}
  commitPage(page,true);
}
function saveQuizDraft(){
  if(!quiz.kind||quiz.questions.length!==10)return;
  const draft={kind:quiz.kind,index:quiz.index,questions:quiz.questions,answers:quiz.answers.slice(),baselineId:quiz.baselineId||null};state.quizDraft=draft;state.quizDrafts={...(state.quizDrafts||{}),[quiz.kind]:draft};save();
}
function restoreDraftQuiz(kind){
  const draft=draftFor(kind);if(draft){state.quizDraft=draft;quiz={kind,index:draft.index,questions:draft.questions.slice(),answers:draft.answers.slice(),baselineId:draft.baselineId||null};setPage('quiz');return true}
  return false;
}
function resetFocus(key){focusRestoreKey=key||focusRestoreKey}
function toast(message){const box=$('#toast-region');const el=document.createElement('div');el.className='toast';el.textContent=message;box.append(el);setTimeout(()=>el.remove(),2800)}
function popConfetti(){if(reducedMotion())return;const colors=['#eab348','#62a46f','#e07758','#6a9fc0','#f4d67b'];for(let i=0;i<42;i++){const p=document.createElement('i');p.className='confetti';p.style.left=Math.random()*100+'vw';p.style.background=colors[i%colors.length];p.style.animationDelay=(Math.random()*.45)+'s';p.style.transform=`rotate(${Math.random()*180}deg)`;document.body.append(p);setTimeout(()=>p.remove(),2100)}}
function startPretest(){
  if(restoreDraftQuiz('pre')){toast('Tes awal dibuka kembali.');return}
  quiz={kind:'pre',index:0,questions:createQuiz('pre'),answers:Array(10).fill(null),baselineId:null};
  saveQuizDraft();setPage('quiz');
}
function startPosttest(){
  if(!allLevelsDone()){toast('Selesaikan semua materi di tiga level lebih dahulu, ya!');setPage('learn');return}
  if(restoreDraftQuiz('post')){toast('Tes akhir dibuka kembali.');return}
  quiz={kind:'post',index:0,questions:createQuiz('post'),answers:Array(10).fill(null),baselineId:state.preAttempts.at(-1)?.id||null};
  saveQuizDraft();setPage('quiz');
}
function openQuizFromBottomNav(){
  if(state.page==='quiz'&&state.quizDraft)return;
  const kind=state.quizDraft?.kind||(draftFor('post')?'post':draftFor('pre')?'pre':allLevelsDone()&&state.preScores&&!state.postScores?'post':'pre');
  if(restoreDraftQuiz(kind))return;
  if(kind==='post'){startPosttest();return}
  startPretest();
}
function beginJourney(){setPage('learn')}
function totalProgress(){const total=[1,2,3].reduce((n,l)=>n+(state.levelProgress[l]||[]).length,0);return Math.round(total/(topics.length*3)*100)}
function bujiCard(message='Hai, teman! Aku Buji. Yuk, belajar sedikit demi sedikit. Tidak apa-apa kalau salah; kita bisa mencoba lagi!'){return `<div class="buji-card"><img src="./buji-avatar-optimized.webp" alt="Buji, pemandu CongklaTika" width="640" height="640" loading="lazy" decoding="async"><div class="buji-bubble"><b>Kata Buji:</b> ${message}</div></div>`}
function pageHeading(kicker,title,sub,withBuji=true){return `<div class="page-heading ${withBuji?'with-buji':''}"><div><span class="eyebrow">${kicker}</span><h1 tabindex="-1" data-focus-key="page-heading">${title}</h1><p>${sub}</p></div>${withBuji?'<img src="./buji-avatar-optimized.webp" alt="" width="640" height="640" loading="lazy" decoding="async">':''}</div>`}
function topicCard(t){return `<button class="topic-card" data-topic="${t.id}"><div class="topic-top"><span class="topic-icon">${t.icon}</span></div><h3>${t.name}</h3><p>${t.desc}</p><span class="topic-status">Buka materi <span>→</span></span></button>`}
function renderHome(){
  const startLabel=state.preScores||totalProgress()>0?'Lanjutkan belajar':'Mulai belajar';
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow"><span class="dot"></span> Petualangan matematika bersama Buji</span><h1 class="display">Belajar asyik,<br><em>main congklak!</em></h1><p class="lead">Berhitung dan bermain bersama Buji. Kamu boleh langsung belajar tanpa tes—pelan-pelan saja, tak perlu takut salah.</p><div class="hero-actions"><button class="primary-button large" data-action="start">${startLabel} <span aria-hidden="true">→</span></button><button class="secondary-button large" data-page="play">Coba main congklak <span aria-hidden="true">⌁</span></button></div><p class="mission-note" role="note">✨ Coba materi Pola Bilangan di menu Belajar.</p><div class="hero-note"><div class="tiny-avatars"><span>🌱</span><span>🔢</span><span>🌟</span></div><span>Belajar kapan saja · tes awal boleh dilewati</span></div></div><div class="hero-sticker"><img src="./buji-avatar-optimized.webp" alt="Buji melambaikan tangan" width="640" height="640" loading="lazy" decoding="async"></div></section>
  <section class="section" id="fitur"><div class="container"><div class="section-heading"><span class="eyebrow">Peta petualangan</span><h2>Satu papan, banyak hal seru</h2><p>Belajar tambah, kurang, kali, bagi, pecahan, dan pola bilangan lewat cerita, latihan, dan congklak.</p></div><div class="feature-grid"><article class="feature-card"><div class="feature-icon">🧭</div><h3>Jalur belajar</h3><p>Kenali tambah, kurang, kali, bagi, pecahan, dan pola bilangan lewat contoh biji congklak.</p></article><article class="feature-card"><div class="feature-icon">🪵</div><h3>Main congklak</h3><p>Belajar strategi, bergiliran, dan berhitung. Ajak teman atau tantang komputer!</p></article><article class="feature-card"><div class="feature-icon">📈</div><h3>Lihat kemajuan</h3><p>Kalau mau, bandingkan hasil sebelum dan sesudah belajar. Setiap langkah kecil tetap berarti!</p></article></div></div></section>
  <section class="section" style="padding-top:0"><div class="container"><div class="band"><div class="band-emoji">🧺</div><div><h2>Petualanganmu menunggu!</h2><p>Pilih materi yang ingin dipelajari. Tes awal boleh dikerjakan atau dilewati. Tes ini melihat bekal awalmu.</p></div><button class="primary-button" data-action="start">${state.preScores||totalProgress()>0?'Lanjut belajar':'Pilih materi'} →</button></div></div></section>
  <section class="section" style="padding-top:0"><div class="container"><div class="section-heading"><span class="eyebrow">Belajar sesuai langkahmu</span><h2>Dari biji kecil jadi ide besar</h2><p>Enam materi matematika dengan tantangan yang makin seru di setiap level.</p></div><div class="topic-grid">${topics.map(topicCard).join('')}</div></div></section>
  <section class="section" style="padding-top:0"><div class="container"><div class="band"><div class="band-emoji">📖</div><div><h2>Kisah di balik papan congklak</h2><p>Kenali permainan tradisional yang punya banyak nama, cerita, dan aturan di berbagai daerah.</p></div><button class="primary-button" data-page="history">Jelajahi kisahnya →</button></div></div></section>`;
}
function renderLearn(){
  const topic=state.activeTopic?currentTopic():null;
  const done=(state.levelProgress[state.activeLevel]||[]).length;
  const pct=totalProgress();
  let html=`<div class="container page-wrap">${pageHeading('Ruang belajar','Ayo, belajar bersama Buji!','Pilih level dan kumpulkan bintang sedikit demi sedikit.')}${bujiCard(topic?topic.tip:'Pilih satu materi. Kita lihat contoh, lalu coba satu soal. Kalau belum benar, tidak apa-apa. Coba lagi, ya!')}<div class="page-toolbar"><span class="tag">Pilih level</span><div class="spacer"></div><span class="small muted">Level ${state.activeLevel}: ${done} dari ${topics.length} materi selesai</span></div><div class="levels-grid">${[1,2,3].map(n=>{const unlocked=levelUnlocked(n);return `<button class="level-card ${state.activeLevel===n?'selected':''} ${unlocked?'':'locked'}" data-level="${n}" ${unlocked?'':'disabled'} aria-pressed="${state.activeLevel===n}" aria-label="Level ${n}${unlocked?'':' terkunci'}"><span class="level-no">${unlocked?n:'🔒'}</span><small>Level ${n}</small></button>`}).join('')}</div><div class="progress-row"><span>🌱 Kemajuan petualangan</span><span>${pct}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><div class="small muted" style="margin-top:7px">Level ${state.activeLevel} · ${levelMissions[state.activeLevel-1]}${state.activeLevel<3?' · semua materi level sebelumnya membuka level ini':''}</div>`;
  if(topic)html+=renderLesson(topic);
  else{
    html+=`<div class="page-toolbar" style="margin-top:25px"><span class="eyebrow">Pilih materi belajar · Level ${state.activeLevel}</span><div class="spacer"></div>${draftFor('pre')?`<button class="ghost-button" data-action="start-pretest">Lanjutkan tes awal</button>`:state.preScores?`<span class="tag">Tes awal terakhir: ${state.preScores.total}/10 benar</span>`:totalProgress()===0?`<button class="ghost-button" data-action="start-pretest">Tes awal (boleh dilewati)</button>`:`<span class="tag">Tes awal dilewati · tetap hebat!</span>`}</div><div class="topic-grid">${topics.map(t=>{const completed=topicDone(state.activeLevel,t.id);return `<button class="topic-card ${completed?'topic-complete':''}" data-topic="${t.id}"><div class="topic-top"><span class="topic-icon">${t.icon}</span></div><h3>${t.name}</h3><p>${t.desc}</p><span class="topic-status ${completed?'done':''}">${completed?'Selesai di level ini':'Mulai tantangan →'}</span></button>`}).join('')}</div>`;
    if(levelDone(state.activeLevel)&&state.activeLevel<3)html+=`<div class="band level-unlock" style="margin-top:20px"><div class="band-emoji">🔓</div><div><h2>Level ${state.activeLevel+1} sudah terbuka!</h2><p>Kerja bagus! Semua materi di level ini sudah selesai.</p></div><button class="primary-button" data-level="${state.activeLevel+1}">Lanjut ke level ${state.activeLevel+1} →</button></div>`;
    const ready=allLevelsDone();
    html+=`<div class="panel" style="margin-top:20px"><div class="page-toolbar" style="margin:0"><div><h2 style="margin:0 0 4px;font:800 24px var(--display)">Tes akhir (boleh dilewati)</h2><span class="small muted">${ready?(state.preScores?'Semua level selesai. Jika mau, bandingkan hasil tesmu!':'Semua materi selesai. Kamu boleh mengerjakan tes akhir meski melewati tes awal.'):'Selesaikan semua materi di tiga level lebih dahulu.'}</span></div><div class="spacer"></div>${draftFor('post')?'<button class="primary-button" data-action="start-posttest">Lanjutkan tes akhir →</button>':`<button class="primary-button" data-action="start-posttest" ${ready?'':'disabled title="Selesaikan semua level lebih dahulu"'}>${state.postScores?'Ulangi tes akhir':'Mulai tes akhir'} →</button>`}</div></div>`;
  }
  return html+'</div>';
}
function visualStepper(topic,key,value,label,min,max){return `<div class="visual-control"><span>${label}</span><div><button class="stepper-button" data-focus-key="visual-${topic}-${key}-minus" data-visual-topic="${topic}" data-visual-key="${key}" data-step="-1" ${value<=min?'disabled':''} aria-label="Kurangi ${label.toLowerCase()}">−</button><strong>${value}</strong><button class="stepper-button" data-focus-key="visual-${topic}-${key}-plus" data-visual-topic="${topic}" data-visual-key="${key}" data-step="1" ${value>=max?'disabled':''} aria-label="Tambah ${label.toLowerCase()}">+</button></div></div>`}
function seedDots(count){
  const shown=Math.min(count,12),extra=Math.max(0,count-shown);
  return Array.from({length:shown},()=>'<i class="seed seed-dot" aria-hidden="true">●</i>').join('')+(extra?`<b class="seed-overflow" aria-label="dan ${extra} biji lagi">+${extra}</b>`:'');
}
function renderQuestionPit(label,count,muted=false,display=count>0?String(count):''){
  const labelText=label?`, ${label}`:'';
  const labelMarkup=label?`<span class="question-pit-label" aria-hidden="true">${esc(label)}</span>`:'';
  const countMarkup=count>0?`<strong class="question-pit-count">${esc(String(display))}</strong>`:'';
  return `<div class="question-pit${muted?' is-muted':''}${count>0?' is-active':''}" aria-label="Lubang congklak, ${count} biji${esc(labelText)}">${labelMarkup}${countMarkup}</div>`;
}
function renderQuestionIllustration(t,prompt){
  const level=state.activeLevel;let title='',description='',operation='',legend='';
  const counts=Array(14).fill(0),labels=Array(14).fill('');
  const data=prompt?.data;
  if(t.id==='addition'){
    const a=data?.a??5,b=data?.b??4;
    title='Gabungkan dua kelompok';description='Setiap lubang berisi satu kelompok biji.';
    operation=`${a} biji + ${b} biji`;counts[2]=a;counts[4]=b;labels[2]='A';labels[4]='B';
    legend='Hitung biji pada kelompok A dan B, lalu jumlahkan.';
  }else if(t.id==='subtraction'){
    const a=data?.a??8,b=data?.b??3;
    title='Pindahkan sebagian biji';description='Lubang A menunjukkan jumlah semula; lubang B menunjukkan biji yang dipindahkan.';
    operation=`${a} biji − ${b} biji`;counts[2]=a;counts[4]=b;labels[2]='A';labels[4]='B';
    legend='Cari tahu berapa biji yang tertinggal setelah sebagian dipindahkan.';
  }else if(t.id==='multiplication'){
    const groups=data?.a??2,seeds=data?.b??5;
    title='Kelompok yang sama banyak';description=`Setiap lubang menunjukkan satu kelompok dalam soal. Isinya ${seeds} biji.`;
    operation=`${groups} lubang × ${seeds} biji`;for(let i=0;i<Math.min(groups,14);i++)counts[i]=seeds;
    legend='Bandingkan isi setiap lubang, lalu hitung semua kelompok.';
  }else if(t.id==='division'){
    const total=data?.a??15,groups=data?.b??3;
    title='Bagikan biji sama rata';description=`Sebanyak ${total} biji akan dibagikan sama rata ke ${groups} lubang.`;
    operation=`${total} biji ÷ ${groups} lubang`;counts[0]=total;
    legend='Bagaimana agar semua lubang mendapat jumlah biji yang sama?';
  }else if(t.id==='number-pattern'){
    const seq=data?.seq||(level===1?[2,4,6]:level===2?[1,4,7]:[2,7,12]);
    title='Lihat urutan angka';description='Setiap lubang menunjukkan satu angka. Bandingkan jumlah biji di lubang yang berdekatan.';
    operation=`${seq.join(', ')}, …`;
    seq.forEach((value,i)=>{counts[i]=value});
    legend='Bandingkan jumlah biji di lubang yang berdekatan.';
  }else if(t.id==='fraction'){
    title='Bagian sama besar di papan';
    description=level===1?'Empat bagian sama besar mewakili satu utuh.':level===2?'Lihat empat bagian sama besar. Dua bagiannya dipilih.':'Perhatikan bagian-bagian yang ditunjukkan dalam soal.';
    operation=data?.text||(level===1?'1 dari 3 bagian':level===2?'2/6 = …':'1/4 + 2/4 = …');
    const parts=data?.parts||(level===1?3:level===2?6:4);
    for(let i=0;i<Math.min(parts,14);i++)counts[i+1]=1;
    legend=level===3?'Perhatikan bagian-bagian yang disebutkan dalam soal. Bagaimana hasilnya?':'Bagian berwarna menunjukkan bagian yang dipilih; semuanya harus sama besar.';
  }else return '';
  const firstRow=Array.from({length:7},(_,i)=>renderQuestionPit(labels[i],counts[i],counts[i]===0)).join('');
  const secondRow=Array.from({length:7},(_,i)=>{const index=i+7;return renderQuestionPit(labels[index],counts[index],counts[index]===0)}).join('');
  const rowLabels=counts.map((count,i)=>`Lubang ${i+1}: ${count} biji`).join('; ');
  return `<section class="question-illustration" data-question-illustration="${t.id}-${level}" aria-label="Ilustrasi congklak untuk ${esc(t.name)}, level ${level}"><div class="question-illustration-heading"><span class="eyebrow">Ilustrasi ${esc(t.name.toLowerCase())}</span><strong>${title}</strong><p>${description}</p></div><div class="question-board" role="img" aria-label="Papan congklak dengan 14 lubang kecil dalam dua baris, tujuh lubang tiap baris, dan dua lumbung di ujung. ${esc(operation)}. ${esc(description)}. ${rowLabels}."><div class="question-board-row"><span class="question-board-store" aria-hidden="true">Lumbung</span><div class="question-pit-rows"><div class="question-pit-row" aria-hidden="true">${firstRow}</div><div class="question-pit-row" aria-hidden="true">${secondRow}</div></div><span class="question-board-store" aria-hidden="true">Lumbung</span></div></div><p class="question-operation">${operation}</p><p class="question-legend">${legend}</p></section>`;
}
function renderVisualPractice(t){
  const prompt=levelChallenges[t.id][state.activeLevel-1],questionDiagram=renderQuestionIllustration(t,prompt);
  const m=visualModel[t.id];if(!m)return questionDiagram;
  let title='',controls='',picture='',equation='';
  if(t.id==='multiplication'){
    title='Buat kelompok biji yang sama banyak';
    controls=visualStepper(t.id,'groups',m.groups,'Kelompok',2,5)+visualStepper(t.id,'seeds',m.seeds,'Biji tiap kelompok',1,6);
    picture=`<div class="visual-groups">${Array.from({length:m.groups},(_,i)=>`<div class="visual-group" aria-label="Kelompok ${i+1}, ${m.seeds} biji"><span>${seedDots(m.seeds)}</span></div>`).join('')}</div>`;
    equation=`${m.groups} kelompok × ${m.seeds} biji = <strong>${m.groups*m.seeds} biji</strong>`;
  }else if(t.id==='division'){
    const each=m.total/m.groups,choices=[2,3,4,6],at=choices.indexOf(m.groups);
    title='Bagikan biji sama rata';
    controls=`<div class="visual-control"><span>Lubang tujuan</span><div><button class="stepper-button" data-visual-topic="division" data-visual-key="groups" data-step="-1" data-focus-key="visual-division-groups-minus" ${at<=0?'disabled':''} aria-label="Kurangi jumlah lubang">−</button><strong>${m.groups}</strong><button class="stepper-button" data-visual-topic="division" data-visual-key="groups" data-step="1" data-focus-key="visual-division-groups-plus" ${at>=choices.length-1?'disabled':''} aria-label="Tambah jumlah lubang">+</button></div></div><span class="visual-note">Jumlah biji tetap ${m.total}</span>`;
    picture=`<div class="visual-groups">${Array.from({length:m.groups},(_,i)=>`<div class="visual-group" aria-label="Lubang ${i+1}, ${each} biji"><span>${seedDots(each)}</span></div>`).join('')}</div>`;
    equation=`${m.total} biji ÷ ${m.groups} lubang = <strong>${each} biji tiap lubang</strong>`;
  }else{
    title='Lihat bagian dari satu utuh';
    controls=visualStepper(t.id,'parts',m.parts,'Bagian sama besar',2,4)+visualStepper(t.id,'selected',m.selected,'Bagian yang diambil',1,m.parts);
    picture=`<div class="fraction-bar" role="img" aria-label="${m.selected} dari ${m.parts} bagian diwarnai">${Array.from({length:m.parts},(_,i)=>`<span class="fraction-part ${i<m.selected?'chosen':''}"></span>`).join('')}</div>`;
    equation=`${m.selected} dari ${m.parts} bagian sama besar = <strong>${m.selected}/${m.parts}</strong>`;
  }
  return `${questionDiagram}<section class="visual-practice" aria-label="Latihan visual ${t.name}"><div class="visual-heading"><span class="eyebrow">Coba sendiri · latihan dengan gambar</span><h3>${title}</h3><p>Tekan + atau −. Lihat perubahan gambar dan hitung jumlahnya.</p></div><div class="visual-controls">${controls}</div>${picture}<div class="visual-equation" aria-live="polite">${equation}</div></section>`;
}
function renderLessonGuide(t){
  const guide=lessonGuides[t.id][state.activeLevel-1];
  return `<section class="lesson-guide" aria-labelledby="lesson-guide-title"><div class="lesson-guide-intro"><span class="eyebrow">Belajar langkah demi langkah · Level ${state.activeLevel}</span><h3 id="lesson-guide-title">Pahami ${esc(t.name.toLowerCase())}</h3><p>${esc(guide.concept)}</p></div><div class="lesson-guide-bridge"><h4>Dari benda ke simbol</h4><ol>${guide.bridge.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></div><div class="lesson-guide-summary"><h4>Ringkasan</h4><p>${esc(guide.summary)}</p><p><strong>Bayangkan di papan congklak:</strong> ${esc(guide.congklak)}</p></div></section>`;
}
function workedExample(t){
  const guide=lessonGuides[t.id][state.activeLevel-1];
  return `<div class="example-box worked-example"><strong>${esc(guide.exampleTitle)}</strong><p>${esc(guide.example)}</p><ol>${guide.worked.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></div>`;
}
function renderMaterialProgress(t){
  const position=topics.findIndex(item=>item.id===t.id)+1,completed=(state.levelProgress[state.activeLevel]||[]).length,percent=Math.round(position/topics.length*100);
  return `<section class="lesson-progress" data-material-progress="${t.id}"><div class="progress-row"><span>Materi ${position} dari ${topics.length} · Level ${state.activeLevel}</span><span>${completed} dari ${topics.length} materi selesai</span></div><div class="progress-track" role="progressbar" aria-label="Posisi materi di Level ${state.activeLevel}" aria-valuemin="1" aria-valuemax="${topics.length}" aria-valuenow="${position}" aria-valuetext="Materi ${position} dari ${topics.length}, Level ${state.activeLevel}"><div class="progress-fill" style="width:${percent}%"></div></div></section>`;
}
function renderLesson(t){
  const session=getTopicChallengeSession(t.id,state.activeLevel);
  const qIndex=Math.min(2,Math.max(0,session.currentIndex||0));
  const currentQ=session.questions[qIndex];
  const currentAnswer=session.answers[qIndex];
  const hasAnsweredCurrent=currentAnswer!==null;
  const isCurrentCorrect=hasAnsweredCurrent&&currentAnswer===currentQ.answer;
  const completed=topicDone(state.activeLevel,t.id);
  const isAllAnswered=session.answers.every(a=>a!==null);
  const canComplete=session.correctCount>=2||completed;

  let miniFeedback='';
  if(hasAnsweredCurrent){
    if(isCurrentCorrect){
      miniFeedback=`<p class="inline-message" aria-live="polite">Hebat, jawabanmu benar! 🌟</p>`;
    }else{
      miniFeedback=`<p class="inline-message error" aria-live="polite">Belum benar. Tidak apa-apa! ${esc(currentQ.hint)} Coba terus, ya.</p>`;
    }
  }

  let stepperAction='';
  if(hasAnsweredCurrent&&qIndex<2){
    stepperAction=`<div style="margin-top:12px"><button class="secondary-button" data-action="next-topic-question" data-topic-id="${t.id}">Soal berikutnya (${qIndex+2}/3) →</button></div>`;
  }else if(isAllAnswered){
    stepperAction=`<div class="topic-challenge-summary" style="margin-top:12px;padding:12px;border-radius:12px;background:#f5f8f2;border:1px solid #dce8d5"><p style="margin:0 0 6px"><strong>Hasil tantangan:</strong> ${session.correctCount} dari 3 soal benar.</p>${session.correctCount>=2?'<p style="margin:0;color:#286b46">🎉 Syarat 2 dari 3 soal terpenuhi! Kamu bisa menandai materi ini selesai.</p>':'<p style="margin:0;color:#6d5940">Belum mencapai 2 soal benar, tidak apa-apa! Buji temani kamu mencoba lagi.</p><button class="ghost-button" style="margin-top:8px" data-action="reset-topic-challenge" data-topic-id="${t.id}">Ulangi tantangan ↻</button>'}</div>`;
  }

  return `<div class="lesson-layout" style="margin-top:22px"><article class="lesson-card"><div class="page-toolbar"><span class="topic-icon">${t.icon}</span><span class="tag">${t.tag} · Level ${state.activeLevel}</span><div class="spacer"></div><button class="ghost-button audio-toggle" data-action="read-current" aria-pressed="${narrationActive}">${narrationActive?'⏹ Hentikan bacaan':'🔊 Dengarkan Buji'}</button></div>${renderMaterialProgress(t)}<h2>${t.name}</h2><p>${esc(t.lesson)}</p>${renderLessonGuide(t)}${workedExample(t)}${renderVisualPractice(t)}<div class="mini-question ${hasAnsweredCurrent?(isCurrentCorrect?'answer-correct':'answer-wrong'):''}"><strong>🎯 Tantangan singkat · Soal ${qIndex+1} dari 3</strong><p style="margin:5px 0 0">${esc(currentQ.text)}</p><div class="answer-row" role="radiogroup" aria-label="Pilihan jawaban untuk tantangan ${t.name}">${currentQ.options.map((a,i)=>`<button class="answer-chip ${currentAnswer===i?'selected':''}" role="radio" aria-checked="${currentAnswer===i}" tabindex="${currentAnswer===i||(!hasAnsweredCurrent&&i===0)?0:-1}" data-focus-key="practice-${t.id}-${i}" data-practice="${t.id}" data-answer="${i}" ${hasAnsweredCurrent?'disabled':''}>${esc(a)}</button>`).join('')}</div>${miniFeedback}${stepperAction}</div><div class="page-toolbar" style="margin-top:20px"><button class="ghost-button" data-action="back-topics">← Semua materi</button><div class="spacer"></div><button class="primary-button" data-action="complete-topic" data-topic-id="${t.id}" ${canComplete?'':'disabled'}>${completed?'Selesai di level ini ✓':'Tandai sudah selesai'}</button></div></article><aside class="lesson-aside"><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">💡 Petunjuk dari Buji</h3><p class="muted small" style="margin:0">${esc(t.tip)}</p></div><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">🗺️ Perjalanan 3 level</h3><p class="muted small">Selesaikan semua enam materi di satu level untuk membuka level berikutnya. Selesaikan minimal 2 dari 3 soal tantangan. Semua angka tetap di bawah 100.</p><span class="tag">Sekarang: Level ${state.activeLevel}</span></div><div class="panel"><h3 style="font:800 21px var(--display);margin:0 0 8px">🎧 Dengarkan</h3><p class="muted small" style="margin:0">Buji membacakan materi dan soal yang sedang terbuka. Musik akan dipelankan sementara.</p></div></aside></div>`;
}
function renderQuiz(){
  const questions=quizQuestionsFor(quiz.kind),q=questions[quiz.index];
  if(!quiz.kind||!q){state.page='home';return renderHome()}
  const isPre=quiz.kind==='pre',label=isPre?'Tes awal':'Tes akhir',ans=quiz.answers[quiz.index],answered=quiz.answers.filter(x=>x!==null).length;
  return `<div class="container page-wrap">${pageHeading(isPre?'Sebelum mulai':'Setelah belajar',isPre?'Lihat kemampuan awalmu!':'Tunjukkan yang sudah kamu pelajari!','Ini latihan, bukan ujian. Baca soal pelan-pelan, lalu pilih jawabanmu.')} ${bujiCard(isPre?'Tidak apa-apa kalau belum tahu semuanya. Kita mulai dari sini, ya!':'Kamu sudah berlatih. Tarik napas, baca soal pelan-pelan, dan lakukan yang terbaik!')}<div class="quiz-card"><div class="quiz-top"><span class="quiz-category">${label} · ${topics.find(t=>t.id===q.cat).name}</span><span>Soal ${quiz.index+1} dari ${questions.length}</span></div><div class="progress-track quiz-answer-progress" role="progressbar" aria-label="Soal kuis yang sudah dijawab" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${answered}" aria-valuetext="${answered} dari ${questions.length} soal terjawab; sedang melihat soal ${quiz.index+1}"><div class="progress-fill" style="width:${answered/questions.length*100}%"></div></div><div class="progress-row"><span>Soal ${quiz.index+1} dari ${questions.length}</span><span>${answered}/${questions.length} terjawab</span></div><h2>${esc(q.q)}</h2><button class="ghost-button audio-toggle" data-action="read-current" aria-pressed="${narrationActive}">${narrationActive?'⏹ Hentikan bacaan':'🔊 Dengarkan soal'}</button><div class="quiz-options" role="radiogroup" aria-label="Pilihan jawaban soal ${quiz.index+1}">${q.options.map((o,i)=>`<button class="quiz-option ${ans===i?'selected':''}" role="radio" aria-checked="${ans===i}" tabindex="${ans===i||ans===null&&i===0?0:-1}" data-focus-key="quiz-${quiz.index}-${i}" data-quiz-answer="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span>${esc(o)}</button>`).join('')}</div><div class="quiz-footer"><button class="ghost-button" data-action="quiz-prev" ${quiz.index===0?'disabled':''}>← Kembali</button><span class="small muted">Jawaban tes tersimpan otomatis</span>${quiz.index===questions.length-1?'<button class="primary-button" data-action="quiz-submit">Lihat hasil tes ✨</button>':'<button class="primary-button" data-action="quiz-next">Berikutnya →</button>'}</div></div></div>`;
}
function scoresByCategory(answers,questions=quizQuestionsFor(quiz.kind)){
  const scores={};quizTopics.forEach(t=>{const indexes=questions.map((q,i)=>q.cat===t.id?i:-1).filter(i=>i>=0);scores[t.id]={correct:indexes.filter(i=>answers[i]===questions[i].answer).length,total:indexes.length}});
  scores.total=answers.filter((a,i)=>a===questions[i].answer).length;return scores;
}
function finishQuiz(){
  const questions=quizQuestionsFor(quiz.kind);if(quiz.answers.some(a=>a===null)){toast('Jawab semua soal dulu supaya hasilnya lengkap.');return}
  const kind=quiz.kind,scores=scoresByCategory(quiz.answers,questions),id=`${kind}-${Date.now()}`,attempt={id,kind,at:new Date().toISOString(),scores,answers:quiz.answers.slice(),questions:questions.map(q=>({...q,options:q.options.slice()})),baselineId:kind==='post'?quiz.baselineId||null:null};
  if(kind==='pre'){state.preScores=scores;state.preAttempts=[...state.preAttempts,attempt].slice(-50)}
  else{state.postScores=scores;state.postAttempts=[...state.postAttempts,attempt].slice(-50)}
  state.lastQuizAttempt=attempt;state.quizDraft=null;state.quizDrafts={...(state.quizDrafts||{}),[kind]:null};state.page='quiz-result';state.resultKind=kind;
  history.replaceState?.({congklatika:true,page:'quiz-result'},'','#quiz-result');save();
  window.congklatikaCloud?.recordQuizAttemptToCloud?.(attempt)?.catch?.(err=>console.warn('Quiz attempt cloud sync deferred:',err));
  popConfetti();render();window.scrollTo({top:0,behavior:motionBehavior()});
}
function adjustVisual(topic,key,step){
  const model=visualModel[topic];if(!model)return;
  if(topic==='division'){const choices=[2,3,4,6],at=choices.indexOf(model.groups);model.groups=choices[Math.max(0,Math.min(choices.length-1,at+step))]}
  else if(topic==='fraction'&&key==='parts'){model.parts=Math.max(2,Math.min(4,model.parts+step));model.selected=Math.min(model.selected,model.parts)}
  else{const limits=topic==='multiplication'?(key==='groups'?[2,5]:[1,6]):(key==='selected'?[1,model.parts]:[2,4]);model[key]=Math.max(limits[0],Math.min(limits[1],model[key]+step))}
  render();
}
function renderQuizResult(){
  const scores=state.resultKind==='pre'?state.preScores:state.resultKind==='post'?state.postScores:(state.preScores||state.postScores);
  if(!scores||typeof scores.total!=='number'){
    state.page=state.preScores||state.postScores?'report':'home';
    state.resultKind=state.preScores?'pre':state.postScores?'post':null;
    return state.page==='report'?renderReport():renderHome();
  }
  const pre=state.resultKind==='pre';
  const attempt=state.lastQuizAttempt,questions=attempt?.questions||[],answers=attempt?.answers||[];
  const review=questions.length?`<section class="panel quiz-review"><h3>Yuk, lihat alasannya</h3>${questions.map((q,i)=>{const right=answers[i]===q.answer;return `<details><summary>Soal ${i+1} · ${right?'Jawabanmu benar':'Yuk, lihat jawabannya'}</summary><p><strong>${esc(q.q)}</strong></p><p>Jawaban benar: ${esc(q.options[q.answer])}. ${esc(q.why||quizReasons[q.cat])}</p></details>`}).join('')}</section>`:'';
  return `<div class="container page-wrap"><div class="quiz-card"><div class="result-hero"><div class="result-star">${pre?'🌱':'🏆'}</div><span class="eyebrow">${pre?'Tes awal selesai':'Tes akhir selesai'}</span><h2>${pre?'Ini awal petualanganmu!':'Lihat seberapa jauh kamu belajar!'}</h2><div class="score-big">${scores.total}<span style="font-size:24px;color:var(--muted)"> dari 10 soal benar</span></div><p class="muted">${pre?'Nilai ini adalah hasil tes awal terbarumu.':'Kamu sudah menyelesaikan tes akhir. Hebat sekali!'}</p></div><div class="panel" style="box-shadow:none"><h3 style="font:800 23px var(--display);margin-bottom:4px">Jumlah jawaban benar per materi</h3><p class="small muted" style="margin-top:0">Angka menunjukkan jumlah soal yang benar dari 2 soal.</p><div style="overflow:auto"><table class="score-table"><thead><tr><th>Materi</th><th>Benar</th><th>Grafik hasil</th></tr></thead><tbody>${quizTopics.map(t=>{const n=scores[t.id].correct;return `<tr><td>${t.icon} ${t.name}</td><td><strong>${n}/2</strong></td><td><div class="bar-compare"><div aria-label="${n} dari 2 benar"><span style="width:${n*50}%"></span></div></div></td></tr>`}).join('')}</tbody></table></div></div>${review}<div class="quiz-footer"><button class="ghost-button" data-page="report">Lihat laporan</button><button class="primary-button" data-action="result-continue">${pre?'Pilih materi belajar':'Lihat laporan belajarku'} →</button></div></div></div>`;
}
function levelReport(){return [1,2,3].map(level=>`<li>Level ${level}: ${(state.levelProgress[level]||[]).length} dari ${topics.length} materi selesai</li>`).join('')}
function renderReport(){
  if(!state.preScores){
    const latest=state.postScores;
    return `<div class="container page-wrap">${pageHeading('Laporan belajar','Perjalanan belajarmu','Kemajuan belajarmu tetap tercatat meski kamu melewati tes awal.')}${bujiCard('Tidak mengerjakan tes awal juga tidak apa-apa. Laporan ini menunjukkan materi yang sudah kamu pelajari dan hasil tes akhir jika kamu mengerjakannya.') }<div class="report-summary"><div class="metric"><strong>${totalProgress()}%</strong><span>Materi yang dipelajari</span></div><div class="metric"><strong>${latest?`${latest.total}/10`:'—'}</strong><span>${latest?'Benar pada tes akhir terakhir':'Tes akhir belum dikerjakan'}</span></div><div class="metric"><strong>${state.postAttempts.length}</strong><span>Tes akhir yang dikerjakan</span></div></div><div class="panel report-materials"><h2>Materi yang sudah dipelajari</h2><ul class="level-report">${levelReport()}</ul><p class="source-note">Kamu melewati tes awal, jadi tidak ada nilai awal untuk dibandingkan. Kamu tidak perlu mengulang tes awal.</p>${latest?`<h3>Tes akhir terakhir</h3><p><strong>${latest.total} dari 10 soal benar.</strong> Jumlah jawaban benar ditampilkan agar mudah dibaca.</p><div class="category-counts">${quizTopics.map(t=>`<span>${t.name}: ${latest[t.id].correct}/2</span>`).join('')}</div>`:''}</div><div class="page-toolbar"><button class="primary-button" data-page="learn">Kembali belajar →</button>${allLevelsDone()?`<button class="ghost-button" data-action="start-posttest">${draftFor('post')?'Lanjutkan tes akhir':'Mulai tes akhir (boleh dilewati)'}</button>`:''}</div></div>`;
  }
  const hasPost=!!state.postScores,preCorrect=state.preScores.total,postCorrect=hasPost?state.postScores.total:null;
  const latestPreAttempt=state.preAttempts.at(-1),latestPostAttempt=state.postAttempts.at(-1);
  const comparisonAttempt=latestPostAttempt?.baselineId?state.preAttempts.find(a=>a.id===latestPostAttempt.baselineId):null;
  const hasComparison=!!hasPost&&!!comparisonAttempt;
  const comparisonScores=hasComparison?comparisonAttempt.scores:state.preScores;
  const baselineLabel=hasComparison?'Tes awal sebelumnya':'Tes awal terbaru';
  const baselineIndex=comparisonAttempt?state.preAttempts.findIndex(a=>a.id===comparisonAttempt.id)+1:0;
  const baselineNote=hasPost&&!hasComparison?'<p class="source-note">Tidak ada tes awal yang dikerjakan sebelum tes akhir ini. Nilai kedua tes disimpan terpisah.</p>':hasComparison&&latestPreAttempt?.id!==comparisonAttempt.id?`<p class="source-note">Tes akhir terakhir dibandingkan dengan tes awal ke-${baselineIndex}. Tes awal yang lebih baru tetap disimpan terpisah.</p>`:'';
  return `<div class="container page-wrap">${pageHeading('Laporan belajar','Lihat hasil belajarmu','Nilai menunjukkan jumlah soal yang benar. Setiap tes tersimpan terpisah.')}${bujiCard(hasPost?(hasComparison?'Setiap langkah belajarmu berharga. Bandingkan jumlah jawaban benar dari tes yang berpasangan.':'Nilai kedua tes disimpan terpisah. Kita tidak membandingkannya karena tes awal tidak dilakukan sebelum tes akhir.'):'Laporan lengkap muncul setelah kamu menyelesaikan tiga level dan mengerjakan tes akhir.') }<div class="report-summary"><div class="metric"><strong>${preCorrect}/10</strong><span>Tes awal terbaru · benar</span></div><div class="metric"><strong>${hasPost?postCorrect+'/10':'—'}</strong><span>${hasPost?'Tes akhir terbaru · benar':'Tes akhir belum dikerjakan'}</span></div><div class="metric"><strong>${totalProgress()}%</strong><span>Materi yang dipelajari</span></div></div><div class="panel"><div class="page-toolbar"><div><h2 style="font:800 25px var(--display);margin:0">Hasil per materi</h2><span class="small muted">Benar dari dua soal. Tes awal yang dikerjakan: ${state.preAttempts.length}; tes akhir yang dikerjakan: ${state.postAttempts.length}.</span></div><div class="spacer"></div><span class="tag">${hasPost?(hasComparison?`${baselineLabel} → Tes akhir`:'Nilai tes terpisah'):'Tes awal terbaru'}</span></div><div style="overflow:auto"><table class="score-table"><thead><tr><th>Materi</th><th>${baselineLabel}</th>${hasPost?`<th>Tes akhir</th>${hasComparison?'<th>Perubahan</th>':''}`:''}<th>Grafik hasil</th></tr></thead><tbody>${quizTopics.map(t=>{const a=comparisonScores[t.id].correct,b=hasPost?state.postScores[t.id].correct:null,d=hasComparison?b-a:null;return `<tr><td>${t.icon} ${t.name}</td><td><strong>${a}/2</strong></td>${hasPost?`<td><strong>${b}/2</strong></td>${hasComparison?`<td class="score-delta ${d>0?'delta-up':d<0?'delta-down':'delta-same'}">${d>0?'+':''}${d} soal</td>`:''}`:''}<td><div class="bar-compare"><div title="Tes awal"><span style="width:${a*50}%"></span></div>${hasComparison?`<div title="Tes akhir"><span style="width:${b*50}%"></span></div>`:''}</div></td></tr>`}).join('')}</tbody></table></div><p class="source-note">Grafik menunjukkan jumlah soal benar dari dua soal untuk setiap materi.</p>${baselineNote}</div><div class="page-toolbar" style="margin-top:18px"><button class="ghost-button" data-page="learn">Kembali belajar</button><div class="spacer"></div><button class="ghost-button" data-action="start-pretest">${draftFor('pre')?'Lanjutkan tes awal':'Ulangi tes awal'}</button>${allLevelsDone()?`<button class="primary-button" data-action="start-posttest">${draftFor('post')?'Lanjutkan tes akhir':state.postScores?'Ulangi tes akhir':'Mulai tes akhir'} →</button>`:''}</div></div>`;
}

function initialStudyBoard(){
  const board=Array(16).fill(0),smallPits=[0,1,2,3,4,5,6,8,9,10,11,12,13,14];
  smallPits.forEach(index=>board[index]=1);
  for(let seed=smallPits.length;seed<98;seed++)board[smallPits[Math.floor(Math.random()*smallPits.length)]]++;
  return board;
}
function newStudyRound(){return {pits:initialStudyBoard(),selected:Array(16).fill(false),answered:0}}
function buildStudyQuestion(pitIndex,topicId=studyTopic,count=studyRound?.pits[pitIndex]||0){
  let prompt='',optionsObj={options:[],answer:0},hint='',explanation='';
  if(topicId==='number-pattern'){
    const next=count+6;
    prompt=`Urutan angka: ${count}, ${count+2}, ${count+4}, … Angka berapa setelah ${count+4}?`;
    optionsObj=makeOptions(String(next),[String(next-1),String(next+1),String(next+2)]);
    hint='Cari beda antara dua angka yang berdekatan (selalu bertambah 2). Tambahkan 2 pada angka terakhir.';
    explanation=`Polanya bertambah 2 setiap langkah (${count+2} − ${count} = 2). Jadi, ${count+4} + 2 = ${next}.`;
  }else if(topicId==='addition'){
    const add=3,total=count+add;
    prompt=`Lubang pilihan berisi ${count} biji. Buji menambah ${add} biji. Berapa jumlahnya?`;
    optionsObj=makeOptions(String(total),[String(total-1),String(total+1),String(count+1)]);
    hint=`Mulai dari ${count}, lalu hitung maju ${add} langkah.`;
    explanation=`Menggabungkan ${count} biji dan ${add} biji: ${count} + ${add} = ${total}.`;
  }else if(topicId==='subtraction'){
    const take=Math.min(3,count),remain=count-take;
    prompt=`Lubang pilihan berisi ${count} biji. Pindahkan ${take} biji. Berapa biji yang tersisa?`;
    const wrong1=remain===0?'2':String(remain-1);
    const wrong2=String(remain+1);
    const wrong3=String(count+take);
    optionsObj=makeOptions(String(remain),[wrong1,wrong2,wrong3]);
    hint=`Bayangkan ${take} biji diambil satu per satu dari ${count} biji.`;
    explanation=`Mengambil ${take} biji dari ${count} biji: ${count} − ${take} = ${remain}.`;
  }else if(topicId==='multiplication'){
    const groups=2,total=count*groups;
    prompt=`Bayangkan ${groups} lubang memiliki isi sama seperti lubang pilihan. Setiap lubang berisi ${count} biji. Berapa semuanya?`;
    optionsObj=makeOptions(String(total),[String(count+groups),String(total-2),String(total+2)]);
    hint=`Jumlahkan ${count} sebanyak ${groups} kali: ${count} + ${count}.`;
    explanation=`Dua kelompok yang masing-masing berisi ${count} biji sama dengan 2 × ${count} = ${total}.`;
  }else if(topicId==='division'){
    const groups=2,total=count*groups;
    prompt=`Ada ${total} biji dari dua lubang yang isinya sama. Jika dibagikan rata ke ${groups} lubang, berapa biji tiap lubang?`;
    optionsObj=makeOptions(String(count),[String(count-1),String(count+1),String(total-1)]);
    hint=`Bagikan ${total} biji bergiliran ke ${groups} lubang sampai habis.`;
    explanation=`Membagi ${total} biji sama rata ke 2 lubang: ${total} ÷ 2 = ${count}.`;
  }else{
    const variant=pitIndex%4;
    if(variant===0){
      prompt='Empat bagian sama besar membentuk satu utuh. Satu bagian dari empat ditulis sebagai pecahan apa?';
      optionsObj=makeOptions('1/4',['1/2','3/4','1/3']);
      hint='Angka 1 di atas mewakili 1 bagian, angka 4 di bawah mewakili 4 bagian utuh.';
      explanation='Satu dari empat bagian sama besar adalah seperempat (1/4).';
    }else if(variant===1){
      prompt='Dua kelompok sama banyak membentuk satu utuh. Satu bagian dari dua ditulis sebagai pecahan apa?';
      optionsObj=makeOptions('1/2',['1/4','3/4','2/3']);
      hint='Satu bagian dari dua bagian sama besar disebut setengah atau seperdua.';
      explanation='Satu bagian dari dua bagian sama besar adalah setengah (1/2).';
    }else if(variant===2){
      prompt='Satu utuh dibagi menjadi 4 bagian sama besar. Jika 3 bagian diambil, pecahan apa yang terbentuk?';
      optionsObj=makeOptions('3/4',['1/4','2/4','1/2']);
      hint='Tiga bagian diambil dari total empat bagian sama besar.';
      explanation='Tiga bagian dari empat bagian sama besar ditulis 3/4.';
    }else{
      prompt='Satu utuh dibagi menjadi 3 bagian sama besar. Satu potongannya bernilai pecahan berapa?';
      optionsObj=makeOptions('1/3',['1/2','1/4','2/3']);
      hint='Satu bagian dari tiga bagian sama besar disebut sepertiga.';
      explanation='Satu bagian dari tiga bagian sama besar ditulis 1/3.';
    }
  }
  return {
    pitIndex,
    topicId,
    count,
    prompt,
    options:optionsObj.options,
    answer:optionsObj.answer,
    hint,
    explanation,
    selectedAnswer:null,
    wrongAttempts:0,
    firstWrong:false,
    finalWrong:false,
    isCorrect:null,
    locked:false
  };
}
function selectStudyPit(index){
  if(!studyRound||!Number.isInteger(index)||index<0||index>=16||index===7||index===15||studyRound.pits[index]===0||studyRound.selected[index])return;
  studyQuestion=buildStudyQuestion(index,studyTopic,studyRound.pits[index]);focusRestoreKey=`study-pit-${index}`;playEffect('pick');render();
}
function renderStudyQuestion(){
  const done=studyRound?.answered||0,remaining=14-done,complete=remaining===0;
  const message=complete?`Semua lubang sudah dipilih. ${studyRound.pits[7]} biji terkumpul di lumbung pemain kanan dan ${studyRound.pits[15]} biji di lumbung Buji kiri.`:`Pilih salah satu dari ${remaining} lubang kecil yang masih berisi. Setelah menjawab, semua bijinya berpindah ke lumbung sesuai jawaban.`;
  return `<section class="study-progress-card" aria-live="polite" aria-atomic="true"><div class="study-progress-icon" aria-hidden="true">${complete?'🎉':'🌰'}</div><div class="study-progress-copy"><span class="eyebrow">${complete?'Putaran selesai':'Petunjuk belajar'}</span><h2>${complete?'Hebat, semua lubang sudah dipilih!':`${done} dari 14 lubang dipilih`}</h2><p>${esc(message)}</p><div class="progress-track" role="progressbar" aria-label="Lubang latihan yang sudah dipilih" aria-valuemin="0" aria-valuemax="14" aria-valuenow="${done}"><div class="progress-fill" style="width:${done/14*100}%"></div></div></div></section>`;
}
function answerStudyQuestion(answerIndex){
  const q=studyQuestion;if(!q||!studyRound||q.locked)return;
  const chosen=Number(answerIndex);
  q.selectedAnswer=chosen;
  const isRight=chosen===q.answer;

  if(isRight){
    q.isCorrect=true;
    q.locked=true;
    q.firstWrong=false;
    q.finalWrong=false;
    q.seedCount=studyRound.pits[q.pitIndex];
    q.storeIndex=7;
    if(q.seedCount<1)return;
    studyRound.pits[q.pitIndex]=0;
    studyRound.pits[7]+=q.seedCount;
    studyRound.selected[q.pitIndex]=true;
    studyRound.answered++;
    playEffect('correct');
    modalFocusIntent='feedback';
    render();
    const token=++studyQuestionToken;
    clearTimeout(studyFeedbackTimer);
    studyFeedbackTimer=setTimeout(()=>{
      if(token!==studyQuestionToken)return;
      studyQuestion=null;studyFeedbackTimer=null;
      const next=[0,1,2,3,4,5,6,8,9,10,11,12,13,14].find(index=>!studyRound.selected[index]&&studyRound.pits[index]>0);
      focusRestoreKey=next===undefined?'study-reset':`study-pit-${next}`;render();
    },1200);
    return;
  }

  q.wrongAttempts=(q.wrongAttempts||0)+1;
  if(q.wrongAttempts===1){
    q.isCorrect=false;
    q.firstWrong=true;
    playEffect('retry');
    modalFocusIntent='feedback';
    render();
    return;
  }

  q.isCorrect=false;
  q.firstWrong=false;
  q.finalWrong=true;
  q.locked=true;
  q.seedCount=studyRound.pits[q.pitIndex];
  q.storeIndex=15;
  if(q.seedCount<1)return;
  studyRound.pits[q.pitIndex]=0;
  studyRound.pits[15]+=q.seedCount;
  studyRound.selected[q.pitIndex]=true;
  studyRound.answered++;
  playEffect('retry');
  modalFocusIntent='feedback';
  render();
  const token=++studyQuestionToken;
  clearTimeout(studyFeedbackTimer);
  studyFeedbackTimer=setTimeout(()=>{
    if(token!==studyQuestionToken)return;
    studyQuestion=null;studyFeedbackTimer=null;
    const next=[0,1,2,3,4,5,6,8,9,10,11,12,13,14].find(index=>!studyRound.selected[index]&&studyRound.pits[index]>0);
    focusRestoreKey=next===undefined?'study-reset':`study-pit-${next}`;render();
  },2300);
}
function renderActiveModal(opening=false){
  const root=$('#modal-root');if(!root)return;let html='',kind='';
  if(resetDialogOpen){
    kind='reset-data';html=`<div class="modal-backdrop themed-modal-backdrop reset-modal-backdrop"><section class="themed-modal reset-confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title" aria-describedby="reset-dialog-description" tabindex="-1"><div class="themed-modal-art" aria-hidden="true">🧹</div><span class="eyebrow">Periksa sebelum melanjutkan</span><h2 id="reset-dialog-title">Hapus data di perangkat ini?</h2><p id="reset-dialog-description">Nama panggilan, karakter, kemajuan belajar, nilai tes, jawaban tes yang belum selesai, papan permainan tersimpan, dan pilihan efek suara akan dihapus. Data dari situs lain tetap aman.</p><p class="reset-modal-note">Data belum dihapus. Data baru akan dihapus jika kamu memilih “Hapus data”.</p><div class="themed-modal-actions"><button class="primary-button" type="button" data-action="reset-cancel">Batal</button><button class="danger-confirm-button" type="button" data-action="reset-confirm">Hapus data</button></div></section></div>`;
  }else if(pendingQuizLeavePage!==null){
    kind='quiz-leave';html=`<div class="modal-backdrop themed-modal-backdrop"><section class="themed-modal quiz-leave-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-leave-title" aria-describedby="quiz-leave-description" tabindex="-1"><div class="themed-modal-art" aria-hidden="true">📚</div><span class="eyebrow">Petualanganmu tersimpan</span><h2 id="quiz-leave-title">Tes belum selesai</h2><p id="quiz-leave-description">Jawaban tesmu tersimpan otomatis di perangkat ini. Kamu bisa lanjut sekarang atau keluar dan kembali nanti.</p><div class="themed-modal-actions"><button class="primary-button" data-action="quiz-leave-cancel">Lanjut tes</button><button class="ghost-button" data-action="quiz-leave-confirm">Keluar dari tes</button></div></section></div>`;
  }else if(state.page==='play'&&playMode==='learning'&&studyQuestion){
    kind='study-question';const q=studyQuestion,topic=topics.find(item=>item.id===q.topicId);
    let feedback='';
    if(q.isCorrect===true){
      feedback=`<p class="study-feedback is-correct" role="status" tabindex="-1" data-study-feedback>Hebat! Jawabanmu benar 🌟 ${q.seedCount} biji dari lubang ini masuk ke lumbung pemain di kanan.</p>`;
    }else if(q.firstWrong){
      feedback=`<div class="study-feedback is-retry" role="status" tabindex="-1" data-study-feedback><p style="margin:0 0 4px"><strong>Belum tepat, tidak apa-apa!</strong></p><p class="study-hint-text" style="margin:0 0 4px">💡 <em>Petunjuk Buji:</em> ${esc(q.hint)}</p><p style="margin:0">Yuk, coba satu kali lagi pada pilihan di atas!</p></div>`;
    }else if(q.finalWrong){
      feedback=`<div class="study-feedback is-retry" role="status" tabindex="-1" data-study-feedback><p style="margin:0 0 4px"><strong>Masih belum tepat, tetap semangat!</strong></p><p style="margin:0 0 4px">Jawaban yang benar adalah <strong>${esc(q.options[q.answer])}</strong>. ${esc(q.explanation||q.hint)}</p><p style="margin:0">${q.seedCount} biji masuk ke lumbung Buji di kiri. Yuk, pilih lubang lain!</p></div>`;
    }
    const modalArt=q.isCorrect===true?'🌟':(q.firstWrong?'💡':(q.finalWrong?'🌱':'🌰'));
    const modalClass=q.isCorrect===true?'answer-correct':((q.firstWrong||q.finalWrong)?'answer-wrong':'');
    const promptSub=q.locked?'Jawabanmu sudah disimpan. Biji sedang dipindahkan ke lumbung.':(q.firstWrong?'Baca petunjuk di bawah, lalu pilih jawaban terbaikmu!':`Jumlah biji di lubang ini: ${q.count}. Pilih jawaban yang menurutmu tepat.`);
    html=`<div class="modal-backdrop themed-modal-backdrop study-modal-backdrop"><section class="themed-modal study-question-modal ${modalClass}" role="dialog" aria-modal="true" aria-labelledby="study-question-title" aria-describedby="study-question-description" tabindex="-1"><div class="study-modal-top"><span class="eyebrow">Soal dari lubang ${q.pitIndex<7?q.pitIndex+1:15-q.pitIndex}${q.firstWrong?' · Kesempatan kedua':''}</span><span class="study-modal-topic">${topic.icon} ${esc(topic.name)}</span></div><div class="themed-modal-art study-modal-art" aria-hidden="true">${modalArt}</div><h2 id="study-question-title">${esc(q.prompt)}</h2><p id="study-question-description" class="study-modal-hint">${promptSub}</p><div class="study-question-options" role="radiogroup" aria-label="Pilihan jawaban untuk ${esc(topic.name)}">${q.options.map((option,i)=>{const isSelected=q.selectedAnswer===i;return `<button class="study-answer-button ${isSelected?'selected':''}" role="radio" aria-checked="${isSelected}" tabindex="${isSelected||(q.selectedAnswer===null&&i===0)?0:-1}" data-focus-key="study-answer-${i}" data-study-answer="${i}" ${q.locked?'disabled':''}>${esc(option)}</button>`}).join('')}</div>${feedback}</section></div>`;
  }else if(profileDialogOpen){
    kind='profile';const required=profileDialogRequired;
    html=`<div class="modal-backdrop themed-modal-backdrop profile-modal-backdrop"><section class="themed-modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title" aria-describedby="profile-dialog-description" tabindex="-1"><div class="themed-modal-art" aria-hidden="true">${required?'🌱':'✨'}</div><span class="eyebrow">${required?'Selamat datang di CongklaTika':'Profil pemain'}</span><h2 id="profile-dialog-title">${required?'Kenalan dulu, yuk!':'Ubah nama dan karakter'}</h2><p id="profile-dialog-description">${required?'Tulis nama panggilan dan pilih karakter sebelum mulai, atau masuk ke akun Username & PIN milikmu.':'Pilih nama panggilan dan karakter baru. Kemajuan dan nilai tesmu tetap aman.'}</p><form id="profile-form" class="profile-form"><label class="form-field" for="profile-name">Nama panggilan<input id="profile-name" name="name" value="${esc(profileDialogName)}" maxlength="24" placeholder="Contoh: Dira" autocomplete="nickname" required></label><fieldset class="profile-character-fieldset"><legend>Pilih karakter</legend><div class="profile-character-grid" role="radiogroup" aria-label="Pilih karakter pemain">${playerCharacters.map(character=>`<button type="button" class="profile-character-option ${profileDialogCharacter===character.id?'selected':''}" role="radio" aria-checked="${profileDialogCharacter===character.id}" tabindex="${profileDialogCharacter===character.id?0:-1}" data-profile-character="${character.id}"><span aria-hidden="true">${character.emoji}</span><b>${character.name}</b></button>`).join('')}</div></fieldset><p class="profile-form-error" id="profile-error" role="alert" hidden>Tulis nama panggilan dulu, ya.</p><div class="themed-modal-actions"><button class="primary-button" type="submit">${required?'Mulai petualangan!':'Simpan perubahan'}</button>${required?'<button class="ghost-button" type="button" data-action="onboarding-to-login">Masuk Username &amp; PIN</button>':'<button class="ghost-button" type="button" data-action="close-profile">Batal</button>'}</div></form><p class="profile-local-note">${cloudSession.signedIn?`Tersambung ke Firebase (@${esc(cloudSession.username)}).`:'Progres tersimpan di perangkat ini dan bisa disambungkan ke Firebase kapan saja.'}</p></section></div>`;
  }
  root.innerHTML=html;
  if(!kind){modalKind='';modalFocusIntent=null;return}
  const changed=modalKind!==kind;modalKind=kind;
  if(opening||changed){const initial=kind==='quiz-leave'?root.querySelector('[data-action="quiz-leave-cancel"]'):kind==='study-question'?root.querySelector('[data-study-answer]'):kind==='reset-data'?root.querySelector('[data-action="reset-cancel"]'):root.querySelector('#profile-name');(initial||root.querySelector('[role="dialog"]'))?.focus({preventScroll:true})}
  else if(modalFocusIntent==='feedback'){root.querySelector('[data-study-feedback]')?.focus({preventScroll:true});modalFocusIntent=null}
}
function selectPlayMode(mode){
  if(!['traditional','learning'].includes(mode)||playMode===mode)return;
  playMode=mode;studyQuestion=null;clearTimeout(studyFeedbackTimer);studyFeedbackTimer=null;
  if(mode==='learning')studyRound=newStudyRound();focusRestoreKey=`play-mode-${mode}`;render();
}

function renderPlay(){
  if(!state.game){state.game=initialGame();save()}
  const learning=playMode==='learning',g=state.game;if(learning&&!studyRound)studyRound=newStudyRound();const p=learning?studyRound.pits:g.pits,top=[14,13,12,11,10,9,8],bottom=[0,1,2,3,4,5,6];
  const turnLabel=g.turn===0?`Giliran ${playerLabel(0)}`:g.mode==='ai'?'Giliran Buji':'Giliran temanmu';
  const pit=(i,own)=>{
    const count=p[i],picked=learning&&studyRound.selected[i],canUse=learning?count>0&&!picked:!g.over&&!g.animating&&!g.aiThinking&&g.turn===own&&count>0;
    const focus=learning?`study-pit-${i}`:`pit-${i}`;
    const aria=learning?`Lubang ${own===0?i+1:15-i}, berisi ${count} biji${picked?'. Sudah dipilih.':'. Pilih untuk membuka soal.'}`:`Lubang ${own===0?i+1:15-i} ${esc(playerLabel(own))}, berisi ${count} biji`;
    const data=learning?`data-study-pit="${i}"`:`data-pit="${i}"`;
    return `<button class="pit ${canUse?'playable':''} ${learning&&picked?'study-picked':''} ${!learning&&g.last===i?'last-drop':''}" ${data} data-focus-key="${focus}" ${canUse?'':'disabled'} aria-label="${aria}" ${picked?'aria-disabled="true"':''}><span class="seeds" aria-hidden="true">${seedDots(count)}</span><span class="seed-count">${count}</span></button>`;
  };
  const modes=`<section class="play-mode-picker" aria-labelledby="play-mode-heading"><div class="game-setup-heading"><h2 id="play-mode-heading">Pilih cara bermain</h2></div><div class="game-mode-picker" role="group" aria-label="Pilih cara bermain"><button class="mode-choice ${learning?'':'active'}" data-play-mode="traditional" data-focus-key="play-mode-traditional" aria-pressed="${!learning}"><span aria-hidden="true">🌰</span><b>Tradisional</b><small>Tabur biji dan bermain sesuai giliran</small></button><button class="mode-choice ${learning?'active':''}" data-play-mode="learning" data-focus-key="play-mode-learning" aria-pressed="${learning}"><span aria-hidden="true">📘</span><b>Belajar</b><small>Ketuk lubang untuk membuka soal latihan</small></button></div></section>`;
  const traditionalSetup=learning?'':`<section class="game-setup" aria-labelledby="game-mode-heading"><div class="game-setup-heading"><h2 id="game-mode-heading">Pilih teman bermain</h2>${effectsButton(true)}</div><div class="game-mode-picker" role="group" aria-label="Pilih lawan"><button class="mode-choice ${g.mode==='two'?'active':''}" data-game-mode="two" aria-pressed="${g.mode==='two'}" ${g.animating||g.aiThinking?'disabled':''}><span aria-hidden="true">👫</span><b>2 pemain</b><small>Main bersama teman</small></button><button class="mode-choice ${g.mode==='ai'?'active':''}" data-game-mode="ai" aria-pressed="${g.mode==='ai'}" ${g.animating||g.aiThinking?'disabled':''}><span aria-hidden="true">🤖</span><b>Buji</b><small>Ayo bermain melawan komputer</small></button></div></section>`;
  const studyPicker=learning?`<section class="study-topic-picker" aria-labelledby="study-topic-heading"><h2 id="study-topic-heading">Pilih jenis soal</h2><div class="study-topic-options" role="group" aria-label="Jenis latihan">${topics.map(topic=>`<button class="study-topic-button ${studyTopic===topic.id?'selected':''}" data-study-topic="${topic.id}" data-focus-key="study-topic-${topic.id}" aria-pressed="${studyTopic===topic.id}">${topic.icon} ${topic.name}</button>`).join('')}</div></section>`:'';
  const turn=learning?(studyRound.answered===14?'Putaran selesai! Semua biji sudah terkumpul.':'Pilih lubang kecil yang masih berisi biji.'):g.over?g.message:g.animating?'Biji sedang ditabur satu per satu…':g.aiThinking?'Buji sedang memilih lubang…':turnLabel;
  const topName=learning?'Buji':playerLabel(1),bottomName=learning?(state.name||'Pemain'):playerLabel(0),storeTop=p[15],storeBottom=p[7];
  const actions=learning?`<div class="game-actions"><button class="ghost-button" data-action="study-reset" data-focus-key="study-reset">Mulai putaran baru</button></div>`:`<div class="game-actions"><button class="secondary-button" data-action="new-game" ${g.animating||g.aiThinking?'disabled':''}>↻ Mulai ulang</button><button class="ghost-button" data-action="undo-move" ${!g.undoStack?.length||g.animating||g.aiThinking?'disabled':''}>↶ Batalkan langkah terakhir</button><button class="ghost-button" data-action="show-hint" aria-expanded="false">💡 Petunjuk</button><button class="ghost-button" data-action="show-rules">Cara bermain</button></div><p id="game-hint" class="game-hint" hidden>Mulai dari lubang berisi biji di barismu. Sebarkan biji satu per satu. Kamu bisa membuka cara bermain kapan saja.</p><details class="panel game-rules" id="game-rules"><summary>🌰 Cara bermain congklak</summary><p class="small muted">Permainan ini memakai aturan sederhana. Aturan congklak bisa berbeda di tiap daerah.</p><div class="rules-grid"><div class="rule-step"><b>01 · Ambil</b><p>Pilih satu lubang di barismu yang masih berisi biji.</p></div><div class="rule-step"><b>02 · Sebar</b><p>Sebarkan biji satu per satu searah putaran. Lewati lumbung lawan. Jika biji terakhir jatuh di lubang yang masih berisi, ambil biji di sana. Lalu, lanjutkan menabur.</p></div><div class="rule-step"><b>03 · Kumpulkan</b><p>Jika biji terakhir jatuh di lumbungmu, kamu mendapat giliran lagi. Jika jatuh di lubang kosong di barismu, ambil biji di lubang seberang. Permainan selesai saat satu baris kosong.</p></div></div><p class="small muted" style="margin-bottom:0">Saat permainan selesai, sisa biji masuk ke lumbung pemilik baris.</p></details>`;
  return `<div class="container page-wrap play-page ${learning?'learning-mode':''}">${pageHeading(learning?'Mode belajar':'Mode tradisional','Ayo main congklak!',learning?'Pilih jenis soal, lalu ketuk lubang yang berisi biji untuk berlatih bersama Buji.':'Bergiliran, hitung bijinya, dan kumpulkan biji sebanyak-banyaknya di lumbungmu.')}${bujiCard(learning?'Pilih penjumlahan, pengurangan, perkalian, pembagian, pecahan, atau pola bilangan. Ketuk lubang bernomor untuk membuka soal. Jawabanmu tidak mengubah permainan atau nilai tes.':g.mode==='ai'?'Ayo tantang aku! Aku akan memilih lubang dan menabur biji satu per satu. Kamu mulai dulu, ya!':'Kita bisa bermain berdua di satu perangkat. Pemain yang duduk di bawah mulai dulu, ya!')}${modes}${traditionalSetup}${studyPicker}<div class="turn-banner ${!learning&&(g.animating||g.aiThinking)?'is-busy':''}" role="status" tabindex="-1"><span aria-hidden="true"></span><strong>${esc(turn)}</strong></div><div class="board-shell" aria-label="Papan congklak; ${learning?'latihan tanpa mengubah permainan':'jumlah seluruh biji tetap 98'}"><div class="board-labels"><span>Lumbung ${esc(topName)}</span><span>${learning?'Pilih salah satu lubang':'Lubang congklak'}</span><span>Lumbung ${esc(bottomName)}</span></div><div class="board-play-area"><div class="store-pit" data-store="15" aria-label="Lumbung ${esc(topName)}, berisi ${storeTop} biji"><span class="store-count">${storeTop}</span><small>${esc(topName.toUpperCase())}</small></div><div class="pits"><div class="pit-row" aria-label="Lubang ${esc(topName)}">${top.map(i=>pit(i,1)).join('')}</div><div class="pit-row" aria-label="Lubang ${esc(bottomName)}">${bottom.map(i=>pit(i,0)).join('')}</div></div><div class="store-pit" data-store="7" aria-label="Lumbung ${esc(bottomName)}, berisi ${storeBottom} biji"><span class="store-count">${storeBottom}</span><small>${esc(bottomName.toUpperCase())}</small></div></div></div>${learning?'':`<div class="game-feedback"><span class="game-message-label">Pesan giliran</span><p class="game-message" aria-live="polite">${esc(g.message)}</p></div>`}${learning?renderStudyQuestion():''}${actions}</div>`;
}
function initialGame(mode='two'){return {pits:Array(16).fill(0).map((_,i)=>i===7||i===15?0:7),turn:0,over:false,mode,animating:false,aiThinking:false,undoStack:[],message:'Pilih lubang berisi biji untuk mulai.'}}
function playerLabel(side){if(side===0)return state.name||'Kamu';return state.game?.mode==='ai'?'Buji':'Temanmu'}
function gameNode(index){return index===7||index===15?document.querySelector(`[data-store="${index}"]`):document.querySelector(`[data-pit="${index}"]`)}
function syncPit(index){
  const g=state.game,p=g.pits[index],node=gameNode(index);if(!node)return;
  if(index===7||index===15){const count=$('.store-count',node);if(count)count.textContent=String(p);node.setAttribute('aria-label',`Lumbung ${playerLabel(index===7?0:1)}, berisi ${p} biji`);return}
  const count=$('.seed-count',node),seeds=$('.seeds',node);if(count)count.textContent=String(p);if(seeds)seeds.innerHTML=seedDots(p);node.setAttribute('aria-label',`Lubang ${index<7?index+1:15-index} ${playerLabel(index<7?0:1)}, berisi ${p} biji`);
}
function cancelInFlightMove(){
  if(!state.game?.animating)return;
  moveGeneration++;$$('.seed-flight').forEach(x=>x.remove());
  if(activeMoveSnapshot)state.game={...activeMoveSnapshot,pits:activeMoveSnapshot.pits.slice(),undoStack:activeMoveSnapshot.undoStack.slice(),animating:false,aiThinking:false};
  else state.game={...state.game,animating:false,aiThinking:false};
  activeMoveSnapshot=null;state.game.message='Langkah dibatalkan saat meninggalkan papan. Semua biji tetap aman.';save();
}
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function animateSeed(from,to,generation){
  const source=gameNode(from),target=gameNode(to);let flight=null;
  if(source&&target&&!reducedMotion()){
    const a=source.getBoundingClientRect(),b=target.getBoundingClientRect();flight=document.createElement('i');flight.className='seed-flight';flight.style.left=`${a.left+a.width/2-5}px`;flight.style.top=`${a.top+a.height/2-5}px`;document.body.append(flight);requestAnimationFrame(()=>{if(flight?.isConnected)flight.style.transform=`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.72)`});
  }
  await wait(150);
  if(generation!==moveGeneration||!state.game?.animating){flight?.remove();return false}
  flight?.remove();state.game.pits[to]++;syncPit(to);const node=gameNode(to);node?.classList.add('drop-flash');setTimeout(()=>node?.classList.remove('drop-flash'),380);playTone(590+(to%7)*32,.075);return true;
}
function endGame(g,p){
  const bottomEmpty=p.slice(0,7).every(x=>x===0),topEmpty=p.slice(8,15).every(x=>x===0);
  if(!bottomEmpty&&!topEmpty)return false;
  if(!bottomEmpty){p[7]+=p.slice(0,7).reduce((a,b)=>a+b,0);for(let i=0;i<7;i++)p[i]=0}
  if(!topEmpty){p[15]+=p.slice(8,15).reduce((a,b)=>a+b,0);for(let i=8;i<15;i++)p[i]=0}
  g.over=true;g.message=p[7]===p[15]?'Seri! Jumlah biji kalian sama banyak.':p[7]>p[15]?`${playerLabel(0)} menang dengan ${p[7]} biji!`:`${playerLabel(1)} menang dengan ${p[15]} biji!`;
  state.gamesPlayed=(state.gamesPlayed||0)+1;if(p[7]>p[15])state.gamesWon=(state.gamesWon||0)+1;
  playTone(840,.2);setTimeout(()=>playTone(1060,.2),180);popConfetti();return true;
}
async function movePit(index,automated=false){
  const g=state.game;if(!g||g.over||g.animating)return;
  const p=g.pits,player=g.turn,isOwn=i=>player===0?i>=0&&i<=6:i>=8&&i<=14;
  if(!isOwn(index)||p[index]===0||(!automated&&player===1&&g.mode==='ai'))return;
  playEffect('pick');
  const ownStore=player===0?7:15,oppStore=player===0?15:7;
  activeMoveSnapshot={...g,pits:g.pits.slice(),undoStack:(g.undoStack||[]).map(x=>({...x,pits:x.pits.slice()})),animating:false,aiThinking:false};
  const generation=++moveGeneration;
  // Persist the last complete, 98-seed board before the first animated drop.
  save();
  g.undoStack=Array.isArray(g.undoStack)?g.undoStack:[];g.undoStack.push({pits:g.pits.slice(),turn:g.turn,over:g.over,message:g.message});if(g.undoStack.length>40)g.undoStack.shift();
  const pickedCount=p[index];g.animating=true;g.aiThinking=false;g.message=`${player===0?playerLabel(0):playerLabel(1)} mengambil biji…`;g.last=index;render();if(player===1)toast(`${g.mode==='ai'?'Buji':'Temanmu'} mengambil ${pickedCount} biji dan mulai menabur.`);
  let seeds=p[index],pos=index,from=index,extraTurn=false,relays=0,captureAmount=0,message='';p[index]=0;syncPit(index);
  while(true){
    while(seeds>0){pos=(pos+1)%16;if(pos===oppStore)continue;const placed=await animateSeed(from,pos,generation);if(!placed)return;seeds--;from=pos}
    if(generation!==moveGeneration||state.game!==g)return;
    if(pos===ownStore){extraTurn=true;message='Biji terakhir jatuh di lumbung sendiri. Dapat giliran lagi!';break}
    if(p[pos]>1){await wait(170);if(generation!==moveGeneration||state.game!==g)return;seeds=p[pos];p[pos]=0;syncPit(pos);from=pos;relays++;continue}
    if(isOwn(pos)&&p[14-pos]>0){const captured=p[14-pos]+p[pos];p[ownStore]+=captured;p[14-pos]=0;p[pos]=0;captureAmount=captured;syncPit(14-pos);syncPit(pos);syncPit(ownStore);message=`Tangkap! ${captured} biji masuk ke lumbung.`}
    else message='Biji terakhir jatuh di lubang kosong. Giliran selesai.';
    break;
  }
  g.last=pos;const finished=endGame(g,p);
  if(!finished){if(!extraTurn)g.turn=1-player;g.message=(relays?`Biji disebar lanjut ${relays} kali. `:'')+message+(extraTurn?'':` Sekarang giliran ${playerLabel(g.turn)}.`)}
  g.animating=false;activeMoveSnapshot=null;save();render();
  if(captureAmount||relays){
    if(captureAmount){const store=gameNode(ownStore);store?.classList.add('capture-pop');setTimeout(()=>store?.classList.remove('capture-pop'),720);playEffect('capture')}
    if(relays){const board=$('.board-shell');board?.classList.add('combo-glow');setTimeout(()=>board?.classList.remove('combo-glow'),900);playEffect('combo')}
    toast(captureAmount&&relays?`Tangkap beruntun! ${relays} sambungan dan ${captureAmount} biji masuk ke lumbung.`:captureAmount?`Tangkap! ${captureAmount} biji masuk ke lumbung ${player===1&&g.mode==='ai'?'Buji':playerLabel(player)}.`:`Biji berpindah berantai ${relays} kali.`);
  }
  if(!g.over&&!extraTurn&&g.turn===1)toast(g.mode==='ai'?'Giliran Buji! Buji sedang memilih lubang.':'Giliran temanmu.');
  if(!g.over&&g.mode==='ai'&&g.turn===1){const aiReq=++aiGeneration;setTimeout(()=>{if(aiReq===aiGeneration)runAiTurn()},650)}
}
function undoGameMove(){
  const g=state.game;if(!g||g.animating||g.aiThinking||!g.undoStack?.length){toast('Belum ada langkah yang bisa dibatalkan.');return}
  const history=g.undoStack.slice();let snapshot=history.pop();
  if(g.mode==='ai'&&snapshot?.turn===1){while(snapshot&&snapshot.turn!==0&&history.length)snapshot=history.pop()}
  if(!snapshot){toast('Langkah sebelumnya tidak ditemukan.');return}
  aiGeneration++;g.pits=snapshot.pits.slice();g.turn=snapshot.turn;g.over=false;g.animating=false;g.aiThinking=false;g.last=null;g.undoStack=history;g.message='Langkah terakhir dibatalkan. Silakan coba pilihan lain.';save();render();toast('Langkah terakhir dibatalkan!');
}
function simulateMove(source,index,player){
  const p=source.slice(),ownStore=player===0?7:15,oppStore=player===0?15:7,isOwn=i=>player===0?i>=0&&i<=6:i>=8&&i<=14;
  let seeds=p[index],pos=index,extra=false,capture=0,loops=0;p[index]=0;
  while(loops++<120){while(seeds>0){pos=(pos+1)%16;if(pos===oppStore)continue;p[pos]++;seeds--}if(pos===ownStore){extra=true;break}if(p[pos]>1){seeds=p[pos];p[pos]=0;continue}if(isOwn(pos)&&p[14-pos]>0){capture=p[14-pos]+p[pos];p[ownStore]+=capture;p[14-pos]=0;p[pos]=0}break}
  return {board:p,extra,capture,gain:p[ownStore]-source[ownStore],last:pos};
}
function chooseAiMove(){
  const legal=[8,9,10,11,12,13,14].filter(i=>state.game.pits[i]>0);if(!legal.length)return -1;
  return legal.map(i=>{const r=simulateMove(state.game.pits,i,1);const opponentOptions=[0,1,2,3,4,5,6].filter(j=>r.board[j]>0);const danger=opponentOptions.reduce((n,j)=>{const move=simulateMove(r.board,j,0);return n+Math.max(0,move.capture)},0);return {i,score:r.gain*3+r.capture*1.6+(r.extra?12:0)-danger*.22+Math.random()*1.8}}).sort((a,b)=>b.score-a.score)[0].i;
}
async function runAiTurn(){
  const g=state.game;if(!g||g.over||g.turn!==1||g.mode!=='ai'||g.animating||g.aiThinking||state.page!=='play')return;
  const request=++aiGeneration;g.aiThinking=true;g.message='Buji sedang memilih lubang…';save();render();await wait(550);
  if(request!==aiGeneration||state.game!==g||state.page!=='play')return;
  const choice=chooseAiMove();g.aiThinking=false;
  if(choice<0){g.over=true;g.message='Permainan selesai. Yuk, mulai lagi!';save();render();return}
  await movePit(choice,true);
}
function selectGameMode(mode){if(!['two','ai'].includes(mode))return;if(state.game?.animating||state.game?.aiThinking)return;aiGeneration++;state.game=initialGame(mode);save();render();toast(mode==='ai'?'Buji siap ditantang!':'Papan untuk dua pemain sudah siap!')}

function renderHistory(){return `<div class="container page-wrap">${pageHeading('Cerita di balik biji','Dari mana congklak berasal?','Permainan ini punya banyak nama dan cerita. Berikut hal yang sudah diketahui dan hal yang masih diperkirakan.')}${bujiCard('Ada hal tentang sejarah congklak yang sudah tercatat. Ada juga yang masih diperkirakan.')}<div class="history-layout"><article class="panel history-card"><span class="eyebrow">Jejak perjalanan</span><div class="timeline"><div class="timeline-item"><h3>Congklak dan keluarga mancala</h3><p>Congklak termasuk keluarga permainan mancala. Dalam permainan ini, biji dipindahkan dan dihitung di papan berlubang. Permainan serupa ditemukan di banyak bagian dunia.</p></div><div class="timeline-item"><h3>Asal-usulnya belum pasti</h3><p>Beberapa sumber menghubungkan permainan mancala dengan Timur Tengah. Belum ada satu cerita pasti tentang asal congklak atau kapan congklak masuk ke Indonesia.</p></div><div class="timeline-item"><h3>Menyebar ke banyak tempat</h3><p>Permainan ini mungkin menyebar ke Asia Tenggara bersama para pedagang. Setiap daerah bisa punya papan, nama, dan aturan yang berbeda.</p></div><div class="timeline-item"><h3>Nama dan papan berbeda</h3><p>Di beberapa daerah, permainan ini disebut congklak atau dakon. Banyak papan punya dua baris lubang kecil dan dua lumbung besar.</p></div></div></article><aside class="lesson-aside"><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">Apa yang kamu latih?</h3><ul class="fact-list"><li>Berhitung dan memperkirakan jumlah</li><li>Menyusun strategi dan memilih langkah</li><li>Menunggu giliran</li><li>Mengikuti aturan bersama</li></ul></div><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">Tahukah kamu?</h3><p class="small muted">Aturan congklak bisa berbeda di tiap daerah. Tanya keluarga atau teman tentang cara bermain di daerahmu!</p></div><div class="panel"><h3 style="font:800 21px var(--display);margin:0 0 8px">Sumber bacaan</h3><p class="small"><a href="https://disdikpora.bulelengkab.go.id/informasi/detail/artikel/62_mengenal-kembali-permainan-tradisional-nusantara-asal-usul-dan-nilainya" target="_blank" rel="noopener noreferrer">Dinas Pendidikan, Pemuda dan Olahraga Kabupaten Buleleng — Congklak</a></p><p class="small"><a href="https://www.nlb.gov.sg/main/article-detail?cmsuuid=7bedd52d-ff96-472d-b423-4dc6790e98c8" target="_blank" rel="noopener noreferrer">Singapore National Library Board — Congkak</a></p><p class="source-note">Asal congklak belum diketahui pasti. Nama dan aturan permainannya bisa berbeda di tiap daerah.</p></div></aside></div><div class="band" style="margin-top:22px"><div class="band-emoji">🪵</div><div><h2>Mau coba main?</h2><p>Gunakan papan ini untuk berlatih berhitung dan bermain bersama teman atau Buji.</p></div><button class="primary-button" data-page="play">Main sekarang →</button></div></div>`}
function renderTeam(){
  const members=[
    {name:'Dimas Yuli Rakasiwi',nim:'26011140011',image:'team-dimas-optimized.webp'},
    {name:'Alfi Syahrin',nim:'26011140019',image:'team-alfi-optimized.webp'},
    {name:'Muhammad Faisal',nim:'26011140007',image:'team-faisal-optimized.webp'},
    {name:'Putri Ayu Diah Lestari',nim:'26011140015',image:'team-putri-optimized.webp'}
  ];
  return `<section class="container page-wrap team-page"><header class="team-heading"><h1 class="team-title">Kenalan dengan tim</h1><p class="team-class">Kami membuat CongklaTika untuk menemani kamu belajar sambil bermain.</p><p class="team-member-id">RPL 26 S2 · Teknologi Pembelajaran, UNY</p></header><div class="team-grid team-roster">${members.map(member=>`<article class="team-card team-member"><div class="team-avatar-wrap"><img class="team-avatar" src="./${member.image}" alt="Ilustrasi karakter ${member.name}" width="480" height="480" loading="lazy" decoding="async"></div><h2 class="team-member-name">${member.name}</h2><p class="team-member-id">Nomor mahasiswa: ${member.nim}</p></article>`).join('')}</div></section>`;
}
function earnedBadges(){
  const lp=state.levelProgress||emptyLevelProgress();
  const anyTopic=(lp[1]||[]).length+(lp[2]||[]).length+(lp[3]||[]).length>=1;
  return [
    {id:'first-seed',icon:'🌱',title:'Benih Pertama',desc:'Selesaikan minimal 1 materi belajar.',unlocked:anyTopic},
    {id:'lvl-1',icon:'🪵',title:'Penjelajah Level 1',desc:'Tuntaskan semua 6 materi Level 1.',unlocked:levelDone(1)},
    {id:'lvl-2',icon:'🧭',title:'Ahli Strategi Level 2',desc:'Tuntaskan semua 6 materi Level 2.',unlocked:levelDone(2)},
    {id:'lvl-3',icon:'🏆',title:'Juara Level 3',desc:'Tuntaskan semua 6 materi Level 3.',unlocked:levelDone(3)},
    {id:'pre-map',icon:'📝',title:'Peta Bekal Awal',desc:'Selesaikan Tes Awal.',unlocked:Boolean(state.preScores)},
    {id:'post-star',icon:'⭐',title:'Lencana Kelulusan',desc:'Selesaikan Tes Akhir.',unlocked:Boolean(state.postScores)},
  ];
}
function renderLogin(){
  const signed=cloudSession.signedIn;
  const character=playerCharacters.find(item=>item.id===state.character)||playerCharacters[0];
  if(signed){
    const uname=cloudSession.username||state.accountUsername||'petualang';
    const badges=earnedBadges(),unlockedCount=badges.filter(b=>b.unlocked).length;
    return `<div class="container page-wrap login-page">${pageHeading('Akun & Cloud Firebase','Kartu Petualangmu','Progres belajar, skor kuis, dan statistik congklakmu terhubung aman ke Firebase Firestore.')}
      ${bujiCard(`Halo ${esc(state.name||uname)}! Akun @${esc(uname)} sedang aktif. Kalau berpindah tablet atau laptop, masuk saja dengan username ini.`)}
      <div class="login-grid">
        <section class="panel account-card">
          <div class="account-card-head">
            <div class="profile-avatar" aria-hidden="true">${character.emoji}</div>
            <div>
              <span class="tag cloud-pill">☁️ Terhubung ke Firebase</span>
              <h2>${esc(state.name||uname)}</h2>
              <p class="muted">@${esc(uname)} · Metode: ${cloudSession.authMethod==='google'?'Akun Google':'Username & PIN'}</p>
            </div>
          </div>
          <div class="account-metrics">
            <div><strong>${totalProgress()}%</strong><span>Progres materi</span></div>
            <div><strong>${unlockedCount}/6</strong><span>Lencana budaya</span></div>
            <div><strong>${state.gamesPlayed||0}</strong><span>Main congklak</span></div>
          </div>
          <div class="login-actions-row">
            <button class="primary-button" type="button" data-action="cloud-sync-now" ${loginBusy?'disabled':''}>${loginBusy?'Menyinkronkan…':'↻ Sinkronkan sekarang'}</button>
            <button class="ghost-button" type="button" data-page="profile">Lihat Paspor &amp; Profil</button>
            <button class="ghost-button danger-button" type="button" data-action="cloud-logout" ${loginBusy?'disabled':''}>Keluar / Ganti Akun</button>
          </div>
        </section>
      </div>
    </div>`;
  }
  const isRegister=loginTab==='register';
  const pinType=loginPinVisible?'text':'password';
  const providerNotice=loginNeedsProviderSetup?`<div class="provider-setup-guide" role="region" aria-label="Panduan aktifkan Email/Password di Firebase Console">
    <strong>Aktifkan Provider Email/Password di Firebase Console</strong>
    <p class="small">Untuk login Username + PIN secara penuh, buka <b>Firebase Console → Authentication → Sign-in method → Email/Password</b> pada project <code>still-might-hkpm1</code> lalu aktifkan. Sementara itu, kamu juga bisa langsung mencoba masuk memakai tombol <b>Google</b> di bawah.</p>
  </div>`:'';
  const formHtml=isRegister
    ?`<form id="cloud-register-form" class="login-form" novalidate>
        <div class="login-field-grid">
          <label class="form-field" for="reg-username">Username unik
            <input id="reg-username" name="username" value="${esc(loginUsername)}" maxlength="20" minlength="3" placeholder="contoh: dira_01" autocomplete="username" autocapitalize="none" spellcheck="false" required>
            <small class="field-hint">3–20 karakter: huruf kecil, angka, _ atau - (tanpa spasi).</small>
          </label>
          <label class="form-field" for="reg-name">Nama panggilan
            <input id="reg-name" name="displayName" value="${esc(loginDisplayName||state.name)}" maxlength="24" placeholder="contoh: Dira" autocomplete="nickname" required>
          </label>
        </div>
        <fieldset class="profile-character-fieldset">
          <legend>Pilih karakter pendamping</legend>
          <div class="profile-character-grid" role="radiogroup" aria-label="Pilih karakter akun baru">
            ${playerCharacters.map(c=>`<button type="button" class="profile-character-option ${loginCharacter===c.id?'selected':''}" role="radio" aria-checked="${loginCharacter===c.id}" data-login-character="${c.id}"><span aria-hidden="true">${c.emoji}</span><b>${c.name}</b></button>`).join('')}
          </div>
        </fieldset>
        <div class="login-field-grid">
          <label class="form-field" for="reg-pin">Buat PIN rahasia (4–6 angka)
            <div class="pin-input-wrap">
              <input id="reg-pin" name="pin" type="${pinType}" inputmode="numeric" pattern="\\d{4,6}" maxlength="6" value="${esc(loginPin)}" placeholder="4–6 angka" autocomplete="new-password" required>
              <button class="ghost-button pin-eye" type="button" data-action="toggle-pin-visibility" aria-pressed="${loginPinVisible}">${loginPinVisible?'🙈 Tutup':'👁 Lihat'}</button>
            </div>
          </label>
          <label class="form-field" for="reg-pin-confirm">Ulangi PIN
            <input id="reg-pin-confirm" name="pinConfirm" type="${pinType}" inputmode="numeric" pattern="\\d{4,6}" maxlength="6" value="${esc(loginPinConfirm)}" placeholder="Ketik ulang PIN" autocomplete="new-password" required>
          </label>
        </div>
        ${loginError?`<p class="login-error" role="alert">${esc(loginError)}</p>`:''}
        ${providerNotice}
        <div class="login-submit-row">
          <button class="primary-button large" type="submit" ${loginBusy?'disabled':''}>${loginBusy?'Membuat akun Firebase…':'Daftar &amp; Simpan ke Cloud →'}</button>
        </div>
      </form>`
    :`<form id="cloud-login-form" class="login-form" novalidate>
        <label class="form-field" for="login-username">Username
          <input id="login-username" name="username" value="${esc(loginUsername)}" maxlength="20" minlength="3" placeholder="contoh: dira_01" autocomplete="username" autocapitalize="none" spellcheck="false" required>
        </label>
        <label class="form-field" for="login-pin">PIN rahasia (4–6 angka)
          <div class="pin-input-wrap">
            <input id="login-pin" name="pin" type="${pinType}" inputmode="numeric" pattern="\\d{4,6}" maxlength="6" value="${esc(loginPin)}" placeholder="••••" autocomplete="current-password" required>
            <button class="ghost-button pin-eye" type="button" data-action="toggle-pin-visibility" aria-pressed="${loginPinVisible}">${loginPinVisible?'🙈 Tutup':'👁 Lihat'}</button>
          </div>
        </label>
        <div class="pin-keypad" role="group" aria-label="Papan angka PIN ramah sentuh">
          ${['1','2','3','4','5','6','7','8','9','clear','0','back'].map(key=>`<button type="button" class="pin-key ${key==='clear'||key==='back'?'is-util':''}" data-pin-digit="${key}" aria-label="${key==='clear'?'Kosongkan PIN':key==='back'?'Hapus satu angka':'Angka '+key}">${key==='clear'?'Hapus':key==='back'?'⌫':key}</button>`).join('')}
        </div>
        ${loginError?`<p class="login-error" role="alert">${esc(loginError)}</p>`:''}
        ${providerNotice}
        <div class="login-submit-row">
          <button class="primary-button large" type="submit" ${loginBusy?'disabled':''}>${loginBusy?'Membuka akun…':'Masuk ke Petualangan →'}</button>
        </div>
      </form>`;
  return `<div class="container page-wrap login-page">
    ${pageHeading('Masuk ke CongklaTika','Masuk dengan Username & PIN','Simpan progres belajar, nilai kuis, dan lencana budayamu di Firebase agar bisa dibuka dari perangkat mana saja.')}
    ${bujiCard('Pakai username dan PIN 4–6 angka yang mudah diingat! PIN-mu diproses dengan aman dan tidak disimpan polos.')}
    <div class="login-grid">
      <section class="panel login-card">
        <div class="login-tabs" role="tablist" aria-label="Pilih mode akun">
          <button type="button" role="tab" aria-selected="${!isRegister}" class="login-tab ${!isRegister?'active':''}" data-login-tab="signin">Masuk (Username + PIN)</button>
          <button type="button" role="tab" aria-selected="${isRegister}" class="login-tab ${isRegister?'active':''}" data-login-tab="register">Buat Akun Baru</button>
        </div>
        ${formHtml}
        <div class="login-divider"><span>atau masuk cepat sebagai guru / orang tua</span></div>
        <button class="ghost-button google-login-button" type="button" data-action="login-google" ${loginBusy?'disabled':''}>Masuk dengan Google</button>
        <p class="small muted login-local-fallback"><button class="link-button" type="button" data-page="home">Lanjutkan tanpa akun cloud (simpan lokal saja) →</button></p>
      </section>
      <aside class="panel login-concepts-card">
        <span class="eyebrow">Paspor Petualang</span>
        <h3>Kenapa pakai Username &amp; PIN?</h3>
        <ul class="fact-list">
          <li><b>Ramah anak:</b> Tidak perlu alamat email pribadi untuk mulai belajar.</li>
          <li><b>Bisa ganti pemain:</b> Praktis dipakai bergantian di tablet sekolah atau rumah.</li>
          <li><b>Lencana budaya:</b> Koleksi 6 lencana pencapaian tersimpan di cloud Firebase.</li>
          <li><b>Tetap bisa offline:</b> Progres lokal tersimpan otomatis dan disinkronkan saat online.</li>
        </ul>
      </aside>
    </div>
  </div>`;
}
function renderProfile(){
  const character=playerCharacters.find(item=>item.id===state.character)||playerCharacters[0];
  const badges=earnedBadges(),unlocked=badges.filter(b=>b.unlocked).length;
  const syncText=cloudSession.signedIn?`Tersambung ke Firebase (@${esc(cloudSession.username||state.accountUsername)}).`:'Saat ini disimpan di perangkat. Masuk dengan Username & PIN untuk cadangkan ke Firebase.';
  return `<div class="container page-wrap">${pageHeading('Profil pemain','Atur profilmu','Nama panggilan, karakter, akun cloud, dan Paspor Budaya CongklaTika.')}${bujiCard(cloudSession.signedIn?`Hebat! Akun @${esc(cloudSession.username||state.accountUsername)} sudah terhubung ke Firebase.`:'Nama dan kemajuanmu tersimpan di perangkat ini. Kamu juga bisa menghubungkannya ke Firebase lewat halaman Masuk.')}<div class="profile-layout"><div class="panel profile-card"><div class="profile-avatar" aria-hidden="true">${character.emoji}</div><h2>${state.name?esc(state.name):'Petualang baru'}</h2><p class="muted">Karakter pilihan: ${esc(character.name)}</p><div class="profile-badges-row"><span class="tag">🌱 Progres belajar ${totalProgress()}%</span><span class="tag">${cloudSession.signedIn?`☁️ @${esc(cloudSession.username||state.accountUsername)}`:'📱 Lokal saja'}</span></div><div class="divider"></div><div class="profile-data-actions" style="justify-content:center;margin-top:0"><button class="primary-button" data-action="edit-profile">Ubah nama dan karakter</button><button class="ghost-button" data-page="login">${cloudSession.signedIn?'Kelola Akun Cloud':'Masuk Username &amp; PIN'}</button></div></div><div class="panel"><h2 style="font:800 25px var(--display);margin:0 0 4px">Data &amp; Sinkronisasi</h2><p class="small muted">${syncText}</p><div class="profile-data-actions"><button class="ghost-button" data-action="export-data">Simpan salinan data</button><button class="ghost-button danger-button" data-action="reset-data">Hapus data di perangkat</button></div></div></div><section class="panel passport-panel" aria-labelledby="passport-title"><div class="page-toolbar" style="margin-top:0"><div><span class="eyebrow">Paspor Budaya CongklaTika</span><h2 id="passport-title" style="margin:6px 0 2px;font:800 24px var(--display)">Koleksi Lencana Petualang</h2></div><div class="spacer"></div><span class="tag">${unlocked} dari ${badges.length} terbuka</span></div><div class="badge-grid">${badges.map(b=>`<article class="passport-badge ${b.unlocked?'is-unlocked':'is-locked'}"><span class="passport-badge-icon" aria-hidden="true">${b.icon}</span><div><b>${b.title}</b><p>${b.desc}</p><span class="passport-badge-state">${b.unlocked?'Terbuka ✓':'Belum terbuka'}</span></div></article>`).join('')}</div></section></div>`;
}
function exportData(){
  try{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='congklatika-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Salinan data berhasil disimpan.')}
  catch(e){toast('Data belum bisa disimpan di perangkat ini.')}
}
function resetData(){
  if(!resetDialogOpen)return;
  resetDialogOpen=false;resetReturnFocus=null;pendingQuizLeavePage=null;stopNarration();
  clearTimeout(cloudSyncTimer);cloudSyncTimer=null;
  moveGeneration++;aiGeneration++;activeMoveSnapshot=null;$$('.seed-flight').forEach(x=>x.remove());
  clearTimeout(studyFeedbackTimer);studyFeedbackTimer=null;studyQuestionToken++;studyQuestion=null;studyRound=null;playMode='traditional';studyTopic='addition';
  visualModel={multiplication:{groups:3,seeds:4},division:{groups:3,total:12},fraction:{parts:4,selected:1}};
  state={...defaultState,levelProgress:emptyLevelProgress()};quiz={kind:null,index:0,answers:[],questions:[],baselineId:null};practiceAnswered={};profileDialogOpen=true;profileDialogRequired=true;profileDialogName='';profileDialogCharacter='buji';profileReturnFocus=null;
  cloudSession={ready:cloudSession.ready,signedIn:false,uid:'',username:'',authMethod:''};
  window.congklatikaCloud?.logoutAccount?.().catch(()=>{});
  let storageReset=true;
  try{const ownedKeys=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith('congklatika.'))ownedKeys.push(key)}ownedKeys.forEach(key=>{try{localStorage.removeItem(key)}catch(e){storageReset=false}})}catch(e){storageReset=false}
  if(!storageReset)storageWarning();effects.on=true;updateEffectsControls();
  history.replaceState?.({congklatika:true,page:'home'},'','#home');render();toast(storageReset?'Semua data CongklaTika di perangkat ini sudah dihapus.':'Aplikasi kembali ke awal, tetapi sebagian data mungkin masih tersisa karena browser tidak mengizinkan penghapusan.');
}
function render(){
  const app=$('#app'),previousFocus=document.activeElement,hadAppFocus=app.contains(previousFocus),keep=focusRestoreKey||previousFocus?.dataset?.focusKey;focusRestoreKey=null;let content='';
  switch(state.page){case'home':content=renderHome();break;case'learn':content=renderLearn();break;case'quiz':content=renderQuiz();break;case'quiz-result':content=renderQuizResult();break;case'play':content=renderPlay();break;case'history':content=renderHistory();break;case'report':content=renderReport();break;case'team':content=renderTeam();break;case'profile':content=renderProfile();break;case'login':content=renderLogin();break;default:state.page='home';content=renderHome()}
  app.innerHTML=content;updateHeader();$('#year').textContent=new Date().getFullYear();
  if(keep){
    const target=$$('[data-focus-key]',app).find(node=>node.dataset.focusKey===keep);
    if(target&&!target.disabled)target.focus({preventScroll:true});
    else{
      const stepper=keep.match(/^visual-(addition|subtraction|multiplication|division|fraction)-([a-z]+)-(minus|plus)$/);
      if(stepper){const alternate=$$('[data-visual-topic][data-visual-key]',app).find(node=>node.dataset.visualTopic===stepper[1]&&node.dataset.visualKey===stepper[2]&&!node.disabled);alternate?.focus({preventScroll:true})}
      else if(keep.startsWith('pit-'))$('.turn-banner',app)?.focus({preventScroll:true});
    }
  }
  else if(hadAppFocus){const heading=$$('h1,h2',app)[0]||app;if(!heading.hasAttribute('tabindex'))heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true})}
  renderActiveModal();
}
function openLogin(){setPage('login')}
function applyCloudBundle(bundle){
  if(!bundle)return;
  const p=bundle.profile;
  cloudSession={ready:true,signedIn:true,uid:bundle.uid||p?.ownerUid||'',username:bundle.username||p?.username||'',authMethod:bundle.authMethod||p?.authMethod||'username_pin'};
  if(p){
    state.cloudUid=p.ownerUid||cloudSession.uid;
    state.accountUsername=p.username||cloudSession.username;
    state.accountAuthMethod=p.authMethod||cloudSession.authMethod;
    if(p.displayName){state.name=String(p.displayName).trim().slice(0,24);state.profileSaved=true}
    if(playerCharacters.some(c=>c.id===p.character))state.character=p.character;
    const allowed=new Set(topics.map(t=>t.id));
    const mergeLevel=(localArr,cloudArr)=>[...new Set([...(Array.isArray(localArr)?localArr:[]),...(Array.isArray(cloudArr)?cloudArr:[])].filter(id=>allowed.has(id)))];
    state.levelProgress={1:mergeLevel(state.levelProgress[1],p.level1Done),2:mergeLevel(state.levelProgress[2],p.level2Done),3:mergeLevel(state.levelProgress[3],p.level3Done)};
    if(Array.isArray(p.legacyUnlockedLevels))state.legacyUnlockedLevels=[...new Set([...(state.legacyUnlockedLevels||[]),...p.legacyUnlockedLevels.filter(x=>x===2||x===3)])];
    if(Number.isInteger(p.activeLevel))state.activeLevel=Math.max(state.activeLevel||1,Math.min(3,Math.max(1,p.activeLevel)));
    if(Number.isInteger(p.gamesPlayed))state.gamesPlayed=Math.max(state.gamesPlayed||0,p.gamesPlayed);
    if(Number.isInteger(p.gamesWon))state.gamesWon=Math.max(state.gamesWon||0,p.gamesWon);
  }
  if(Array.isArray(bundle.attempts)&&bundle.attempts.length){
    const toScores=a=>({total:a.total,addition:{correct:a.addition,total:2},subtraction:{correct:a.subtraction,total:2},multiplication:{correct:a.multiplication,total:2},division:{correct:a.division,total:2},fraction:{correct:a.fraction,total:2}});
    const preList=bundle.attempts.filter(a=>a.kind==='pre').map(a=>({id:a.attemptId,kind:'pre',at:'',scores:toScores(a),questions:[],answers:[],baselineId:null}));
    const postList=bundle.attempts.filter(a=>a.kind==='post').map(a=>({id:a.attemptId,kind:'post',at:'',scores:toScores(a),questions:[],answers:[],baselineId:a.baselineId||null}));
    if(preList.length&&!state.preAttempts.length){state.preAttempts=preList.slice(-50);state.preScores=preList.at(-1).scores}
    if(postList.length&&!state.postAttempts.length){state.postAttempts=postList.slice(-50);state.postScores=postList.at(-1).scores}
  }
  profileDialogOpen=false;profileDialogRequired=false;
  try{localStorage.setItem(KEY,JSON.stringify(persistedSnapshot()))}catch(e){}
  updateHeader();
}
function attachCloudIntegration(){
  if(cloudObserverAttached||!window.congklatikaCloud?.attachAuthObserver)return;
  cloudObserverAttached=true;
  window.congklatikaCloud.attachAuthObserver(session=>{
    if(!session.signedIn){
      cloudSession={ready:true,signedIn:false,uid:'',username:'',authMethod:''};
      updateHeader();
      if(state.page==='login'||state.page==='profile')render();
      return;
    }
    applyCloudBundle({uid:session.user?.uid,username:session.profile?.username||state.accountUsername,authMethod:session.user?.authMethod,profile:session.profile,attempts:session.attempts});
    if(state.page==='login'||state.page==='profile')render();
  });
}
function openProfileDialog(required=!state.profileSaved){profileReturnFocus=document.activeElement;profileDialogName=state.name||'';profileDialogCharacter=state.character||'buji';profileDialogRequired=required;profileDialogOpen=true;renderActiveModal(true)}
function closeProfileDialog(){if(!profileDialogOpen||profileDialogRequired)return;profileDialogOpen=false;renderActiveModal();const focus=profileReturnFocus;profileReturnFocus=null;if(focus?.isConnected)focus.focus({preventScroll:true})}
function openResetDialog(){if(resetDialogOpen)return;resetReturnFocus=document.activeElement;resetDialogOpen=true;renderActiveModal(true)}
function cancelResetDialog(){if(!resetDialogOpen)return;resetDialogOpen=false;renderActiveModal();const focus=resetReturnFocus;resetReturnFocus=null;if(focus?.isConnected)focus.focus({preventScroll:true})}
function closeModal(){if(resetDialogOpen)cancelResetDialog();else if(pendingQuizLeavePage!==null)cancelQuizLeave();else if(profileDialogOpen)closeProfileDialog()}
async function availableNarrationVoices(){
  const synth=window.speechSynthesis,available=synth.getVoices();if(available.length)return available;
  return new Promise(resolve=>{let finished=false,timer;const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);synth.removeEventListener?.('voiceschanged',finish);resolve(synth.getVoices())};synth.addEventListener?.('voiceschanged',finish);timer=setTimeout(finish,900)});
}
function chooseNarrationVoice(voices){const idVoice=voices.filter(v=>(v.lang||'').toLowerCase().replace('_','-').startsWith('id'));return idVoice[0]||null}
function setMusicDuck(duck){
  if(!musicMaster||!music.ctx)return;
  try{musicMaster.gain.setTargetAtTime(duck?.18:.78,music.ctx.currentTime,.12)}catch(e){}
}
function stopNarration(){
  narrationRequest++;narrationActive=false;
  try{if('speechSynthesis'in window)window.speechSynthesis.cancel()}catch(e){}
  setMusicDuck(false);
}
function updateNarrationButton(){
  $$('[data-action="read-current"]').forEach(button=>{button.setAttribute('aria-pressed',String(narrationActive));button.textContent=narrationActive?'⏹ Hentikan bacaan':state.page==='quiz'?'🔊 Dengarkan soal':'🔊 Dengarkan Buji'});
}
function currentNarrationText(){
  if(state.page==='quiz'){
    const q=quizQuestionsFor(quiz.kind)[quiz.index];return `Soal ${quiz.index+1}. ${q.q} Pilihannya: ${q.options.map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join('. ')}.`;
  }
  const t=currentTopic(),prompt=levelChallenges[t.id][state.activeLevel-1],visual=visualModel[t.id],guide=lessonGuides[t.id][state.activeLevel-1];
  let visualText='';if(t.id==='division')visualText=` Latihan gambar: ${visual.total} biji dibagikan ke ${visual.groups} lubang.`;if(t.id==='multiplication')visualText=` Latihan gambar: ada ${visual.groups} kelompok, masing-masing ${visual.seeds} biji.`;if(t.id==='fraction')visualText=` Latihan gambar menunjukkan ${visual.selected} dari ${visual.parts} bagian.`;
  const lessonText=[t.lesson,guide.concept,...guide.bridge,`Contoh. ${guide.example}`, ...guide.worked,`Ringkasan. ${guide.summary}`,`Bayangkan di papan congklak. ${guide.congklak}`].join(' ');
  return `Materi ${t.name}, level ${state.activeLevel}. ${lessonText}${visualText} Tantangan. ${prompt[0]} Pilihan jawaban: ${prompt[1].join(', ')}.`;
}
async function readCurrentContent(){
  if(narrationActive){stopNarration();updateNarrationButton();return}
  if(!('speechSynthesis'in window)||typeof window.SpeechSynthesisUtterance!=='function'){toast('Buji belum bisa membaca di browser ini.');return}
  const request=++narrationRequest;let text;
  try{text=currentNarrationText();const voices=await availableNarrationVoices();if(request!==narrationRequest)return;speechVoice=chooseNarrationVoice(voices);const utterance=new SpeechSynthesisUtterance(`Halo, teman! Aku Buji. ${text}`);if(speechVoice)utterance.voice=speechVoice;utterance.lang='id-ID';utterance.rate=.92;utterance.pitch=1.15;utterance.volume=1;
    narrationActive=true;setMusicDuck(true);updateNarrationButton();utterance.onend=()=>{if(request===narrationRequest){narrationActive=false;setMusicDuck(false);updateNarrationButton()}};utterance.onerror=()=>{if(request===narrationRequest){narrationActive=false;setMusicDuck(false);updateNarrationButton();toast('Bacaan suara gagal. Kamu tetap bisa membaca materi di layar.')}};window.speechSynthesis.speak(utterance);toast('Buji mulai membacakan bagian ini.');
  }catch(e){narrationActive=false;setMusicDuck(false);updateNarrationButton();toast('Bacaan suara gagal. Kamu tetap bisa membaca materi di layar.')}
}
function startMusic(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx){toast('Musik belum bisa diputar di browser ini.');return}
    if(!music.ctx)music.ctx=new AudioCtx();if(!musicMaster){musicMaster=music.ctx.createGain();musicMaster.gain.value=.78;musicMaster.connect(music.ctx.destination)}music.ctx.resume();music.on=true;music.step=0;
    const notes=[523.25,659.25,783.99,659.25,587.33,698.46,880,783.99];
    music.timer=setInterval(()=>{if(!music.on)return;const now=music.ctx.currentTime,osc=music.ctx.createOscillator(),gain=music.ctx.createGain();osc.type='triangle';osc.frequency.value=notes[music.step++%notes.length];gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.078,now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+.34);osc.connect(gain);gain.connect(musicMaster);osc.start(now);osc.stop(now+.36)},370);
    $('#music-toggle').setAttribute('aria-pressed','true');$('#music-toggle').title='Matikan musik';toast('Musik petualangan siap diputar! ♫');
  }catch(e){toast('Musik belum dapat diputar. Coba lagi.')}
}
function stopMusic(){music.on=false;clearInterval(music.timer);$('#music-toggle').setAttribute('aria-pressed','false');$('#music-toggle').title='Nyalakan musik';if(music.ctx)music.ctx.suspend();toast('Musik dihentikan sementara.')}
function playTone(freq=550,duration=.08,delay=0,volume=.025){
  if(!effects.on||!effects.ctx)return;
  try{
    const c=effects.ctx,now=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();
    c.resume().catch(()=>{});o.type='sine';o.frequency.setValueAtTime(freq,now);
    g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+duration);
    o.connect(g);g.connect(c.destination);effects.voices.add(o);
    o.onended=()=>{effects.voices.delete(o);o.disconnect();g.disconnect()};o.start(now);o.stop(now+duration+.01);
  }catch(e){}
}
function playEffect(kind){
  switch(kind){
    case'correct':playTone(660,.12,0,.035);playTone(880,.17,.1,.03);break;
    case'retry':playTone(330,.12,0,.025);playTone(294,.14,.09,.02);break;
    case'capture':playTone(740,.12,0,.032);playTone(990,.16,.09,.028);break;
    case'combo':playTone(520,.09,0,.028);playTone(700,.09,.07,.028);playTone(880,.12,.14,.025);break;
    case'answer':playTone(620,.09,0,.025);break;
    case'pick':playTone(440,.07,0,.025);break;
    default:playTone(740,.045,0,.018);break;
  }
}
function handleAction(action,el){
  switch(action){
    case'start':beginJourney();break;
    case'start-pretest':startPretest();break;
    case'start-posttest':startPosttest();break;
    case'nav-quiz':openQuizFromBottomNav();break;
    case'complete-topic':{const id=el.dataset.topicId;if(practiceAnswered[id]!==levelChallenges[id][state.activeLevel-1][2]){toast('Jawab tantangan mini dengan benar dulu, ya!');return}if(!topicDone(state.activeLevel,id))state.levelProgress[state.activeLevel].push(id);save();if(levelDone(state.activeLevel)){popConfetti();toast(state.activeLevel<3?`Hebat! Level ${state.activeLevel+1} sudah terbuka!`:'Semua level selesai! Kamu hebat sekali!')}else toast('Materi selesai! Satu langkah hebat.');render();break}
    case'back-topics':state.activeTopic=null;save();render();window.scrollTo({top:0,behavior:motionBehavior()});break;
    case'quiz-next':if(quiz.answers[quiz.index]===null){toast('Pilih satu jawaban dulu, ya!');return}quiz.index++;saveQuizDraft();render();break;
    case'quiz-prev':quiz.index=Math.max(0,quiz.index-1);saveQuizDraft();render();break;
    case'quiz-submit':finishQuiz();break;
    case'result-continue':if(state.resultKind==='pre')setPage('learn');else setPage('report');break;
    case'new-game':aiGeneration++;state.game=initialGame(state.game?.mode||'two');save();render();toast('Papan baru siap dimainkan!');break;
    case'show-rules':{const rules=$('#game-rules');if(rules){rules.open=true;rules.scrollIntoView({behavior:motionBehavior(),block:'center'})}break}
    case'show-hint':{const hint=$('#game-hint'),button=$('[data-action="show-hint"]');if(hint&&button){hint.hidden=!hint.hidden;button.setAttribute('aria-expanded',String(!hint.hidden))}break}
    case'undo-move':undoGameMove();break;
    case'quiz-leave-cancel':cancelQuizLeave();break;
    case'quiz-leave-confirm':leaveQuiz();break;
    case'study-reset':studyQuestion=null;clearTimeout(studyFeedbackTimer);studyFeedbackTimer=null;studyQuestionToken++;studyRound=newStudyRound();focusRestoreKey='study-pit-0';render();break;
    case'read-current':readCurrentContent();break;
    case'export-data':exportData();break;
    case'reset-data':openResetDialog();break;
    case'reset-cancel':cancelResetDialog();break;
    case'reset-confirm':resetData();break;
    case'skip-profile':state.name='';state.profileSaved=false;save();setPage('home');toast('Nama dilewati. Kamu tetap bisa belajar!');break;
    case'edit-profile':openProfileDialog(false);break;
    case'close-profile':closeProfileDialog();break;
    case'onboarding-to-login':profileDialogOpen=false;profileDialogRequired=false;loginError='';loginNeedsProviderSetup=false;setPage('login');break;
    case'toggle-pin-visibility':loginPinVisible=!loginPinVisible;render();break;
    case'login-google':{
      if(!window.congklatikaCloud?.loginWithGoogle){toast('Layanan Firebase sedang disiapkan, coba lagi sebentar.');return}
      loginBusy=true;loginError='';loginNeedsProviderSetup=false;render();
      window.congklatikaCloud.loginWithGoogle({localState:state}).then(res=>{
        loginBusy=false;applyCloudBundle(res);toast(`Selamat datang, ${state.name}! Akun Google terhubung.`);setPage('profile');
      }).catch(err=>{
        loginBusy=false;loginError=err?.message||'Gagal masuk dengan Google.';render();
      });
      break;
    }
    case'cloud-sync-now':{
      if(!window.congklatikaCloud?.syncProgressToCloud)return;
      loginBusy=true;render();
      window.congklatikaCloud.syncProgressToCloud(state).then(()=>{loginBusy=false;render();toast('Progres berhasil disinkronkan ke Firebase!')}).catch(()=>{loginBusy=false;render();toast('Sinkronisasi tertunda. Periksa koneksi internetmu.')});
      break;
    }
    case'cloud-logout':{
      if(!window.congklatikaCloud?.logoutAccount)return;
      loginBusy=true;render();
      window.congklatikaCloud.logoutAccount().then(()=>{
        loginBusy=false;cloudSession={ready:true,signedIn:false,uid:'',username:'',authMethod:''};
        state.cloudUid='';state.accountUsername='';state.accountAuthMethod='';loginPin='';loginPinConfirm='';loginError='';
        save();render();toast('Berhasil keluar. Silakan masuk dengan akun lain.');
      }).catch(()=>{loginBusy=false;render()});
      break;
    }
    case'login':openLogin();break;
    case'close-modal':closeModal();break;
    default:break;
  }
}
document.addEventListener('click',e=>{
  if(e.target.classList.contains('modal-backdrop')){closeModal();return}
  const character=e.target.closest('[data-profile-character]');if(character){profileDialogCharacter=character.dataset.profileCharacter;$$('[data-profile-character]').forEach(button=>{const selected=button.dataset.profileCharacter===profileDialogCharacter;button.classList.toggle('selected',selected);button.setAttribute('aria-checked',String(selected));button.tabIndex=selected?0:-1});return}
  const loginChar=e.target.closest('[data-login-character]');if(loginChar){loginCharacter=loginChar.dataset.loginCharacter;$$('[data-login-character]').forEach(button=>{const selected=button.dataset.loginCharacter===loginCharacter;button.classList.toggle('selected',selected);button.setAttribute('aria-checked',String(selected))});return}
  const tabBtn=e.target.closest('[data-login-tab]');if(tabBtn){loginTab=tabBtn.dataset.loginTab==='register'?'register':'signin';loginError='';loginNeedsProviderSetup=false;render();return}
  const pinKey=e.target.closest('[data-pin-digit]');if(pinKey){const digit=pinKey.dataset.pinDigit;const input=$('#login-pin');if(digit==='clear')loginPin='';else if(digit==='back')loginPin=loginPin.slice(0,-1);else if(loginPin.length<6)loginPin+=digit;if(input)input.value=loginPin;playEffect('click');return}
  const sfx=e.target.closest('[data-sfx-toggle]');if(sfx){toggleEffects();return}
  const control=e.target.closest('button,a,summary');if(control&&!control.disabled){primeEffects();if(!control.matches('[data-pit],[data-quiz-answer],[data-practice],#music-toggle'))playEffect('click')}
  const page=e.target.closest('[data-page]');if(page){e.preventDefault();setPage(page.dataset.page);return}
  const act=e.target.closest('[data-action]');if(act){handleAction(act.dataset.action,act);return}
  const mode=e.target.closest('[data-game-mode]');if(mode){selectGameMode(mode.dataset.gameMode);return}
  const playModeButton=e.target.closest('[data-play-mode]');if(playModeButton){selectPlayMode(playModeButton.dataset.playMode);return}
  const studyTopicButton=e.target.closest('[data-study-topic]');if(studyTopicButton){studyTopic=studyTopicButton.dataset.studyTopic;studyQuestion=null;clearTimeout(studyFeedbackTimer);studyFeedbackTimer=null;focusRestoreKey=studyTopicButton.dataset.focusKey;render();return}
  const studyAnswer=e.target.closest('[data-study-answer]');if(studyAnswer&&studyQuestion){answerStudyQuestion(Number(studyAnswer.dataset.studyAnswer));return}
  const studyPit=e.target.closest('[data-study-pit]');if(studyPit){selectStudyPit(Number(studyPit.dataset.studyPit));return}
  const level=e.target.closest('[data-level]');if(level){const n=Number(level.dataset.level);if(!levelUnlocked(n)){toast(`Selesaikan Level ${n-1} dulu untuk membuka level ini.`);return}practiceAnswered={};state.activeLevel=n;state.activeTopic=null;save();render();toast(`Level ${n} dipilih. Semangat!`);return}
  const topic=e.target.closest('[data-topic]');if(topic){state.activeTopic=topic.dataset.topic;state.page='learn';save();render();window.scrollTo({top:0,behavior:motionBehavior()});return}
  const opt=e.target.closest('[data-quiz-answer]');if(opt){focusRestoreKey=opt.dataset.focusKey;quiz.answers[quiz.index]=Number(opt.dataset.quizAnswer);saveQuizDraft();playEffect('answer');render();return}
  const practice=e.target.closest('[data-practice]');if(practice){focusRestoreKey=practice.dataset.focusKey;const id=practice.dataset.practice;practiceAnswered[id]=Number(practice.dataset.answer);const key=levelChallenges[id][state.activeLevel-1][2];if(practiceAnswered[id]===key){playEffect('correct');popConfetti()}else playEffect('retry');render();return}
  const visual=e.target.closest('[data-visual-topic]');if(visual){focusRestoreKey=visual.dataset.focusKey;adjustVisual(visual.dataset.visualTopic,visual.dataset.visualKey,Number(visual.dataset.step));return}
  const pit=e.target.closest('[data-pit]');if(pit){focusRestoreKey=pit.dataset.focusKey;movePit(Number(pit.dataset.pit));return}
});
document.addEventListener('input',e=>{
  if(e.target.id==='login-username'||e.target.id==='reg-username')loginUsername=e.target.value;
  else if(e.target.id==='login-pin'||e.target.id==='reg-pin')loginPin=e.target.value.replace(/\D/g,'').slice(0,6);
  else if(e.target.id==='reg-pin-confirm')loginPinConfirm=e.target.value.replace(/\D/g,'').slice(0,6);
  else if(e.target.id==='reg-name')loginDisplayName=e.target.value;
});
document.addEventListener('submit',e=>{
  if(e.target.id==='profile-form'){
    e.preventDefault();const data=new FormData(e.target),name=String(data.get('name')||'').trim().slice(0,24);
    if(!name){const error=$('#profile-error'),input=$('#profile-name');if(error)error.hidden=false;input?.focus();return}
    const returnFocus=profileReturnFocus;state.name=name;state.character=playerCharacters.some(character=>character.id===profileDialogCharacter)?profileDialogCharacter:'buji';state.profileSaved=true;profileDialogOpen=false;profileDialogRequired=false;profileReturnFocus=null;save();render();if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});else if(state.page==='profile')$('#app [data-focus-key=\"page-heading\"]')?.focus({preventScroll:true});else $('#app [data-action=\"start\"]')?.focus({preventScroll:true});toast(`Hai, ${state.name}! Profilmu tersimpan.`);
    return;
  }
  if(e.target.id==='cloud-login-form'){
    e.preventDefault();
    const data=new FormData(e.target);
    loginUsername=String(data.get('username')||'').trim().toLowerCase();
    loginPin=String(data.get('pin')||'').trim();
    if(!/^[a-z0-9_-]{3,20}$/.test(loginUsername)){loginError='Username harus 3–20 karakter (huruf kecil, angka, _ atau -).';render();$('#login-username')?.focus();return}
    if(!/^\d{4,6}$/.test(loginPin)){loginError='PIN harus 4 sampai 6 angka.';render();$('#login-pin')?.focus();return}
    if(!window.congklatikaCloud?.loginWithUsernamePin){loginError='Layanan Firebase hanya aktif saat aplikasi berjalan via Vite/production build.';render();return}
    loginBusy=true;loginError='';loginNeedsProviderSetup=false;render();
    window.congklatikaCloud.loginWithUsernamePin({username:loginUsername,pin:loginPin}).then(res=>{
      loginBusy=false;loginPin='';applyCloudBundle(res);toast(`Selamat datang kembali, ${state.name}!`);setPage('profile');
    }).catch(err=>{
      loginBusy=false;loginError=err?.message||'Gagal masuk dengan Username & PIN.';loginNeedsProviderSetup=Boolean(err?.needsProviderSetup);render();
    });
    return;
  }
  if(e.target.id==='cloud-register-form'){
    e.preventDefault();
    const data=new FormData(e.target);
    loginUsername=String(data.get('username')||'').trim().toLowerCase();
    loginDisplayName=String(data.get('displayName')||'').trim().slice(0,24);
    loginPin=String(data.get('pin')||'').trim();
    loginPinConfirm=String(data.get('pinConfirm')||'').trim();
    if(!/^[a-z0-9_-]{3,20}$/.test(loginUsername)){loginError='Username harus 3–20 karakter (huruf kecil, angka, _ atau -).';render();$('#reg-username')?.focus();return}
    if(!loginDisplayName){loginError='Tulis nama panggilan dulu, ya.';render();$('#reg-name')?.focus();return}
    if(!/^\d{4,6}$/.test(loginPin)){loginError='PIN harus 4 sampai 6 angka.';render();$('#reg-pin')?.focus();return}
    if(loginPin!==loginPinConfirm){loginError='Konfirmasi PIN tidak sama. Periksa kembali, ya.';render();$('#reg-pin-confirm')?.focus();return}
    if(!window.congklatikaCloud?.registerWithUsernamePin){loginError='Layanan Firebase hanya aktif saat aplikasi berjalan via Vite/production build.';render();return}
    loginBusy=true;loginError='';loginNeedsProviderSetup=false;render();
    window.congklatikaCloud.registerWithUsernamePin({username:loginUsername,pin:loginPin,displayName:loginDisplayName,character:loginCharacter,localState:state}).then(res=>{
      loginBusy=false;loginPin='';loginPinConfirm='';applyCloudBundle(res);popConfetti();toast(`Akun @${res.username} berhasil dibuat dan terhubung ke Firebase!`);setPage('profile');
    }).catch(err=>{
      loginBusy=false;loginError=err?.message||'Gagal membuat akun baru.';loginNeedsProviderSetup=Boolean(err?.needsProviderSetup);render();
    });
  }
});
window.addEventListener('popstate',e=>{
  const target=validPage(e.state?.page)?e.state.page:(location.hash||'#home').slice(1);
  if(hasQuizDraft()&&target!=='quiz'){history.pushState({congklatika:true,page:state.page},'',`#${state.page}`);showQuizLeaveDialog(target);return}
  commitPage(validPage(target)?target:'home',false);
});

$('#music-toggle').addEventListener('click',()=>music.on?stopMusic():startMusic());
$('#menu-toggle').addEventListener('click',()=>{const nav=$('#main-nav'),expanded=$('#menu-toggle').getAttribute('aria-expanded')==='true';nav.classList.toggle('open',!expanded);$('#menu-toggle').setAttribute('aria-expanded',String(!expanded))});
document.addEventListener('keydown',e=>{
  const dialog=$('#modal-root [role="dialog"]');
  if(dialog){
    if(e.key==='Escape'){e.preventDefault();if(resetDialogOpen)cancelResetDialog();else if(pendingQuizLeavePage!==null)cancelQuizLeave();else if(profileDialogOpen)closeProfileDialog();return}
    if(e.key==='Tab'){const items=$$('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',dialog).filter(node=>node.offsetParent!==null&&node.tabIndex>=0);if(!items.length){e.preventDefault();dialog.focus();return}const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventScroll?.();e.preventDefault();first.focus()}return}
  }else if(e.key==='Escape')closeModal();
  const radio=e.target.closest?.('[data-quiz-answer],[data-practice],[data-study-answer],[data-profile-character],[data-login-character]');
  if(radio&&['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){
    e.preventDefault();const group=radio.closest('[role="radiogroup"]'),items=$$('[role="radio"]',group),at=items.indexOf(radio);
    const next=e.key==='Home'?0:e.key==='End'?items.length-1:(at+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+items.length)%items.length;
    if(radio.hasAttribute('data-study-answer')){
      items.forEach(it=>it.tabIndex=-1);
      if(items[next]){items[next].tabIndex=0;items[next].focus()}
      return;
    }
    items[next]?.focus();items[next]?.click();return;
  }
  if(radio&&radio.hasAttribute('data-study-answer')&&(e.key===' '||e.key==='Enter'||e.key==='Spacebar')){
    e.preventDefault();
    radio.click();
    return;
  }
  if(e.key==='Enter'&&state.page==='quiz'&&e.target.tagName!=='BUTTON'&&quiz.index<quizQuestionsFor(quiz.kind).length-1)handleAction('quiz-next',{});
});
window.addEventListener('congklatika:cloud-ready',attachCloudIntegration);
if(window.congklatikaCloud)attachCloudIntegration();
if(state.quizDraft){quiz={kind:state.quizDraft.kind,index:state.quizDraft.index,answers:state.quizDraft.answers.slice(),questions:state.quizDraft.questions.slice(),baselineId:state.quizDraft.baselineId||null};state.page='quiz'}
render();
if(storageRecoveryNotice)toast('Data sebelumnya rusak atau tidak terbaca. Aplikasi dibuka tanpa kemajuan lama. Kamu tetap bisa belajar.');
if(state.page==='play'&&state.game?.mode==='ai'&&state.game.turn===1&&!state.game.over)setTimeout(runAiTurn,250);
