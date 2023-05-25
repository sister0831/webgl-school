import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';

// DOM がパースされたことを検出するイベントを設定
window.addEventListener('DOMContentLoaded', () => {
  // 制御クラスのインスタンスを生成
  const app = new App3();
  // 初期化
  app.init();
  // 描画
  app.render();
}, false);

/**
 * three.js を効率よく扱うために自家製の制御クラスを定義
 */
class App3 {
  /**
   * カメラ定義のための定数
   */
  static get CAMERA_PARAM() {
    return {
      // fovy は Field of View Y のことで、縦方向の視野角を意味する
      fovy: 60,
      // 描画する空間のアスペクト比（縦横比）
      aspect: window.innerWidth / window.innerHeight,
      // 描画する空間のニアクリップ面（最近面）
      near: 0.1,
      // 描画する空間のファークリップ面（最遠面）
      far: 10000.0,
      // カメラの位置
      x: 420.0,
      y: 420.0,
      z: 420.0,
      // カメラの中止点
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
  }
  /**
   * レンダラー定義のための定数
   */
  static get RENDERER_PARAM() {
    return {
      // レンダラーが背景をリセットする際に使われる背景色
      clearColor: 0xffffff,
      // レンダラーが描画する領域の横幅
      width: window.innerWidth,
      // レンダラーが描画する領域の縦幅
      height: window.innerHeight,
    };
  }
  /**
   * ディレクショナルライト定義のための定数
   */
  static get DIRECTIONAL_LIGHT_PARAM() {
    return {
      color: 0xffffff, // 光の色
      intensity: 1,  // 光の強度
      x: 1.0,          // 光の向きを表すベクトルの X 要素
      y: 1.0,          // 光の向きを表すベクトルの Y 要素
      z: 1.0           // 光の向きを表すベクトルの Z 要素
    };
  }
  /**
   * アンビエントライト定義のための定数
   */
  static get AMBIENT_LIGHT_PARAM() {
    return {
      color: 0xffffff, // 光の色
      intensity: 0.4,  // 光の強度
    };
  }
  /**
   * マテリアル定義のための定数
   */
  static get MATERIAL_PARAM() {
    return {
      // color: 0x3399ff, // マテリアルの基本色
      colors: [
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x0cac18, // コア
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
        0x30E08B, // キューブ
        0x26DEED, // キューブ
        0x28F7CE, // キューブ
      ],
      // blending: THREE.MultiplyBlending,
      // transparent: true
    };
  }

  /**
   * コンストラクタ
   * @constructor
   */
  constructor() {
    this.renderer;         // レンダラ
    this.scene;            // シーン
    this.camera;           // カメラ
    this.directionalLight; // ディレクショナルライト
    this.ambientLight;     // アンビエントライト
    this.material;         // マテリアル
    this.torusGeometry;    // トーラスジオメトリ
    this.torusArray;       // トーラスメッシュの配列 @@@
    this.controls;         // オービットコントロール
    this.axesHelper;       // 軸ヘルパー

    this.isDown = false; // キーの押下状態を保持するフラグ

    // 再帰呼び出しのための this 固定
    this.render = this.render.bind(this);

    // キーの押下や離す操作を検出できるようにする
    window.addEventListener('keydown', (keyEvent) => {
      switch (keyEvent.key) {
        case ' ':
          this.isDown = true;
          break;
        default:
      }
    }, false);
    window.addEventListener('keyup', (keyEvent) => {
      this.isDown = false;
    }, false);

    // リサイズイベント
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);
  }

  /**
   * 初期化処理
   */
  init() {
    // レンダラー
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(App3.RENDERER_PARAM.clearColor));
    this.renderer.setSize(App3.RENDERER_PARAM.width, App3.RENDERER_PARAM.height);
    const wrapper = document.querySelector('#webgl');
    wrapper.appendChild(this.renderer.domElement);

    // シーン
    this.scene = new THREE.Scene();

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      App3.CAMERA_PARAM.fovy,
      App3.CAMERA_PARAM.aspect,
      App3.CAMERA_PARAM.near,
      App3.CAMERA_PARAM.far,
    );
    this.camera.position.set(
      App3.CAMERA_PARAM.x,
      App3.CAMERA_PARAM.y,
      App3.CAMERA_PARAM.z,
    );
    this.camera.lookAt(App3.CAMERA_PARAM.lookAt);

    // ディレクショナルライト（平行光源）
    this.directionalLight = new THREE.DirectionalLight(
      App3.DIRECTIONAL_LIGHT_PARAM.color,
      App3.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.set(
      App3.DIRECTIONAL_LIGHT_PARAM.x,
      App3.DIRECTIONAL_LIGHT_PARAM.y,
      App3.DIRECTIONAL_LIGHT_PARAM.z,
    );
    this.scene.add(this.directionalLight);

    // アンビエントライト（環境光）
    this.ambientLight = new THREE.AmbientLight(
      App3.AMBIENT_LIGHT_PARAM.color,
      App3.AMBIENT_LIGHT_PARAM.intensity,
    );
    this.scene.add(this.ambientLight);

    // マテリアル
    this.material = new THREE.MeshPhongMaterial(App3.MATERIAL_PARAM);
    this.materials = [];
    for (let i = 0; i < App3.MATERIAL_PARAM.colors.length; ++i) {
      const color = App3.MATERIAL_PARAM.colors[i];
      const material = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: .03});
      if(i <= 40 ){
        material.opacity = 1;
      }
      this.materials.push(material);
    }

    // 共通のジオメトリ、マテリアルから、複数のメッシュインスタンスを作成する @@@
    const TORUS_COUNT = this.materials.length;
    const TRANSFORM_SCALE = 1; //init
    this.torusGeometry = new THREE.BoxGeometry(1,1,1);
    this.torusArray = [];
    for (let i = 0; i < TORUS_COUNT; ++i) {
      // トーラスメッシュのインスタンスを生成
      const torus = new THREE.Mesh(this.torusGeometry, this.materials[i]);
      const torusScale = TRANSFORM_SCALE + i * 2.5;
      torus.scale.set(torusScale,torusScale,torusScale);

      // シーンに追加する
      this.scene.add(torus);
      // 配列に入れておく
      this.torusArray.push(torus);
    }

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // ヘルパー
    const axesBarLength = 5.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);
  }

  /**
   * 描画処理
   */
  render() {
    // 恒常ループの設定
    requestAnimationFrame(this.render);

    // コントロールを更新
    this.controls.update();

    // this.torusArray.forEach((torus) => {
    //   torus.scale.multiplyScalar(1.02);
    // });

    // フラグに応じてオブジェクトの状態を変化させる
    if (this.isDown === true) {
      // Y 軸回転 @@@
      this.torusArray.forEach((torus,index) => {
        torus.rotation.y += 0.05;
        torus.rotation.z += 0.02;
        torus.rotation.x += 0.04;
      });
    }
      this.torusArray.forEach((torus,index) => {
        torus.rotation.y += 0.003;
        if(index <= 40){
          torus.rotation.x = (Math.random() * (2 - .01) + .01);
          torus.rotation.y = (Math.random() * (2 - .01) + .01);
          torus.rotation.z = (Math.random() * (2 - .01) + .01);
        }else{
          torus.rotation.y += 0.005;
          torus.rotation.z += 0.002;
          torus.rotation.x += 0.004;
        }
      });

    // レンダラーで描画
    this.renderer.render(this.scene, this.camera);
  }
}

