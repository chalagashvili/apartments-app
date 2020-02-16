import React from 'react';
import './Marker.css';

const Marker = (props: any) => {
  const {
    color, name, id, active, lat, lng, onClick, item, selectedItem,
  } = props;
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
      > ${item.price}
      </div>
      {active && selectedItem.clicked ? <div style={{
        position: 'absolute', top: 38, width: 300, heigth: 300, backgroundColor: 'white', borderRadius: 20, zIndex: 5, overflow: 'hidden',
      }}
      >
        <div
          key={item.lat + item.lng}
        // onMouseOver={e => props.onHover(item)}
        >
          <img
            style={{ objectFit: 'cover' }}
            width={300}
            height={150}
            src={item.image}
            alt="Logo"
          />
          <div style={{ padding: '15px 20px 20px' }} >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <div style={{ fontSize: 19, color: 'black' }} >{item.title}</div>

                <div style={{ fontSize: 12 }} >{item.date.toLocaleDateString()}</div>
              </div>
              <div style={{
                fontSize: 13, paddingBottom: 10, paddingTop: 10,
              }}
              >{item.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }} >
                  <div style={{ fontSize: 14, color: 'black' }} >{item.size} m² </div>
                  <div style={{ color: 'black' }} > &nbsp;• &nbsp;</div>
                  <div style={{ fontSize: 14, color: 'black' }} >{item.rooms} Rooms</div>
                </div>
                <div style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  display: 'flex',
                  color: 'black',
                  paddingBottom: 5,
                  textAlign: 'end',
                }}
                >${item.price}<div style={{ fontWeight: 'normal' }} > / mo</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }} >

                <div style={{
                  fontSize: 13, backgroundColor: '#F7F7F7', borderRadius: 10, padding: '0 10px 0', fontWeight: 'bold', color: 'black', width: 'max-content',
                }}
                >ⓒ {item.realtor}
                </div>

                <div style={{
                  cursor: 'pointer',
                  border: '1px solid black',
                  color: 'rgb(34, 34, 34)',
                  padding: '5px 20px',
                  borderRadius: 5,
                  display: 'flex',
                  alignItems: 'center',
                }}
                >Rent Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> : null}

    </div>
  );
};

export default Marker;
