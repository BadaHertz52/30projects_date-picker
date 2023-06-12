module.exports = {
  //snowpack 빌드에 사용할 ‘현재 경로‘와 빌드 결과로 연결할 ‘빌드 경로‘를 지정
  mount: {
    //정적 파일 디렉토리, snowpack으로 빌드 되지 않음
    public: { url: "/", static: true },
    //snowpack으로 빟드되는 파일들, scr 디렉토리의 파일들은 url경로로 접근
    src: { url: "/dist" },
  },
  optimize: {
    minify: true,
  },
  plugins: ["@snowpack/plugin-sass"],
};
