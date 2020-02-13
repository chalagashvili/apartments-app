import React from 'react';
import './Marker.css';

const Marker = (props: any) => {
  const {
    color, name, id, active, lat, lng, onClick, item, selectedItem,
  } = props;
  console.log(item, 'iitem!!');
  return (
    <div
      className="marker"
      onClick={() => onClick({ lat, lng, clicked: true })}
      title={name}
      style={{
        backgroundColor: active ? 'black' : 'white',
        // width: 50,
        // height: 28,
        // borderRadius: 28,
        // fontSize: 14,
        // display: 'flex',
        // // align-items: center;
        // // justify-content: center;
      }}
    >
      <div style={{
        cursor: 'pointer', color: active ? 'white' : 'black', fontWeight: 'bold', textAlign: 'center',
      }}
      > $107
      </div>
      {active && selectedItem.clicked ? <div style={{
        position: 'absolute', top: 38, width: 300, heigth: 300, backgroundColor: 'white', borderRadius: 20, zIndex: 5, overflow: 'hidden',
      }}
      >
        <div
          style={{
            padding: 20,

          }}
          key={item.lat + item.lng}
        // onMouseOver={e => props.onHover(item)}
        >
          <div style={{ fontSize: 18, color: '#484848' }} >{item.title}</div>
          <div style={{
            fontSize: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 20,
          }}
          >Very light flat. Available only for the customers who don't have any kind of pet. Smoking is not allowed. Some other descriptions please see below.
          </div>
          <div style={{ fontSize: 14 }} >Floor Area Size: 56m2</div>
          <div style={{ fontSize: 14 }} >Rooms: 3</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', display: 'flex' }} >$80{' '} <div style={{ fontWeight: 'normal' }} > / month</div></div>
          <div style={{ fontSize: 14 }} >Added: 13 Feb 2020</div>
          <div style={{ fontSize: 14 }} >Realtor: Sandro Chalagashvili</div>
        </div>
      </div> : null}

    </div>
  );
};

export default Marker;
