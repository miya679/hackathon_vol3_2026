import React, { useState } from 'react';
import './text_regist.css';

export default function MaterialRegistration() {
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState('textbook');
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [message, setMessage] = useState('');

  // 送信処理 
  const handleSubmit = (e) => {
    e.preventDefault(); 

    // 登録するデータオブジェクト
    const registrationData = {
      text_name: materialTitle,
      text_type: materialType,
      text_range: materialType === 'video' ? null : `${startPage}-${endPage}`
    };

    if(Number(startPage) > Number(endPage)){
      alert('開始ページは終了ページ以下の値を入力してください');
    }else{
    console.log('登録データ:', registrationData);
    alert('教材を登録しました');
    }

    setMaterialTitle('');
    setStartPage('');
    setEndPage('');
  };

  return (
    <div className="container">
      <h2 className="title">教材登録</h2>
      <p className="subtitle">学習する教材の情報を登録します。</p>

      <form onSubmit={handleSubmit} className="card">

        {/* 教材名 */}
        <div className="formGroup">
          <label className="label">
            教材名 <span className="required">*</span>
          </label>
          <input
            type="text"
            value={materialTitle}
            onChange={(e) => setMaterialTitle(e.target.value)}
            required
            className="input"
          />
        </div>

        {/* 教材の形式 */}
        <div className="formGroup">
          <label className="label">
            教材の形式 <span className="required">*</span>
          </label>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className="select"
          >
            <option value="textbook">教科書</option>
            <option value="workbook">問題集</option>
            <option value="video">オンライン講義</option>
          </select>
        </div>

        {/* ページ数 (オンライン講義以外の場合に表示) */}
        {materialType !== 'video' && (
          <div className="pageGroup">
            <div className="formGroup">
              <label className="label">
                開始ページ <span className="required">*</span>
              </label>
              <input
                type="number"
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                min="0"
                required
                className="input"
              />
            </div>
            <div className="formGroup">
              <label className="label">
                終了ページ <span className="required">*</span>
              </label>
              <input
                type="number"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                min="1"
                required
                className="input"
              />
            </div>
          </div>
        )}

        <button type="submit" className="button">
          教材を登録
        </button>
      </form>
    </div>

  );
}