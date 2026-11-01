/* Mọi nội dung của template nằm ở file này. Đổi idol = đổi file này + thư mục assets/. */
window.SITE = {
  title: "Blue Hour — The World of Ju Jingyi",
  name: "JU JINGYI",
  tagline: "Blue Hour",

  /* Quote hiện theo giây của bản nhạc: t = giây bắt đầu, d = thời lượng hiển thị.
     Mở trang với ?debug để xem giây hiện tại và chỉnh t cho khớp nhịp.
     (Nội dung dưới đây là placeholder, không phải lời của idol.) */
  quotes: [
    { t: 4,  d: 8, text: "There is a color the sky wears for only a few minutes." },
    { t: 15, d: 8, text: "Silver light, held just before the night." },
    { t: 26, d: 8, text: "Some stories are told in the quiet between two songs." },
    { t: 37, d: 8, text: "Soft on the surface, steady underneath." },
    { t: 48, d: 8, text: "Every frame remembers a different hour." },
    { t: 59, d: 8, text: "Stay for the part where the lights come on." },
    { t: 69, d: 8, text: "Blue, then gold, then gone." }
  ],

  frames: {
    title: "Frames",
    lede: "Scroll slowly. Each frame starts in blue and takes its color back as it reaches the center of the screen.",
    items: [
      { src: "assets/img/p01.jpg", alt: "Portrait in a pink hanfu with a red peony in her hair", caption: "Peony" },
      { src: "assets/img/p02.jpg", alt: "Portrait in deep red light, hair falling over one eye",  caption: "Red room" },
      { src: "assets/img/p03.jpg", alt: "Close portrait in red light",                             caption: "Red room II" },
      { src: "assets/img/p04.jpg", alt: "Black and white close-up, lips and eye",                  caption: "Monochrome" },
      { src: "assets/img/p05.jpg", alt: "Lying on white bedding beside an open book",              caption: "Open book" },
      { src: "assets/img/p06.jpg", alt: "Lying in warm sunlight in a wool sweater",                caption: "Morning wool" },
      { src: "assets/img/p07.jpg", alt: "Close-up with golden bokeh lights",                       caption: "Bokeh" },
      { src: "assets/img/p08.jpg", alt: "Resting her head on her arm in golden light",             caption: "Golden hour" }
    ],
    /* Mỗi "phòng" là một bố cục. layout: solo | pair | mono | trio | wide. items = vị trí trong mảng items ở trên */
    rooms: [
      { title: "Peony",      layout: "solo", items: [0] },
      { title: "Red room",   layout: "pair", items: [1, 2] },
      { title: "Monochrome", layout: "mono", items: [3] },
      { title: "Soft hours", layout: "trio", items: [4, 5, 7] },
      { title: "Bokeh",      layout: "wide", items: [6] }
    ]
  },

  puzzle: {
    title: "Piece it together",
    lede: "Rebuild a frame one piece at a time: click two pieces to swap them, or drag one onto another. A small letter waits at the end.",
    locked: "Finish the puzzle to open the letter.",
    wish: {
      title: "A letter for Jingyi",
      /* Nội dung mẫu, hãy viết lại bằng lời của chính bạn. Tách đoạn bằng một dòng trống. */
      text: "Chị là động lực của em. Những lúc mệt, những lúc muốn dừng lại, chỉ cần nhìn thấy chị vẫn đang cố gắng và tỏa sáng, em lại có thêm sức để đi tiếp.\n\nChúc chị luôn vững bước trên con đường mình chọn: mọi sân khấu đều rực rỡ, mọi vai diễn đều chạm tới trái tim khán giả, và mọi nỗ lực đều được đền đáp xứng đáng.\n\nChúc chị thật nhiều sức khỏe, bình an và niềm vui. Dù ở đâu, em vẫn luôn ở phía sau cổ vũ chị.",
      sign: "Một người hâm mộ luôn được chị tiếp thêm động lực"
    }
  },

  footer: "Fan-made tribute. Not affiliated with Ju Jingyi or her agency. Photos, video and music belong to their respective owners."
};
