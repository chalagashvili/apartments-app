import React from 'react';
import { Pagination } from 'antd';

const CityList = props => (
  <div style={{ width: '50%', padding: 30 }} >
    <div>
      {props.items.map((item, index) => (
        <div
          style={{
            borderTop: '1px solid #EBEBEB',
            padding: 20,
            display: 'flex',
          }}
          key={index}
          onMouseOver={e => props.onHover({ ...item, clicked: false })}
        >
          <div ><img
            style={{ borderRadius: 10, marginRight: 20 }}
            width={300}
            height={200}
            src="https://www.welcome-hotels.com/site/assets/files/30116/welcome_hotel_marburg_superior_1k.600x600.jpg"
            alt="Logo"
          />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
            <div style={{ fontSize: 19, color: 'black' }} >{item.title}</div>
            <div style={{
              fontSize: 13, paddingBottom: 10, paddingRight: 20,
            }}
            >Very light flat. Available only for the customers who don't have any kind of pet. Smoking is not allowed. Some other descriptions please see below.
            </div>
            <div style={{ display: 'flex' }} >
              <div style={{ fontSize: 14, color: 'black' }} >56 m² </div>
              <div style={{ color: 'black' }} > &nbsp;• &nbsp;</div>
              <div style={{ fontSize: 14, color: 'black' }} >3 Rooms</div>

            </div>
            <div style={{ fontSize: 14 }} >Added: 13 Feb 2020</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }} >
              <div style={{
                fontSize: 13, backgroundColor: '#F7F7F7', borderRadius: 10, padding: '0 10px', fontWeight: 'bold', color: 'black',
              }}
              >ⓒ John Lennon
              </div>
              <div style={{
                fontSize: 17, fontWeight: 'bold', display: 'flex', color: 'black',
              }}
              >$80{'  '} <div style={{ fontWeight: 'normal' }} >&nbsp; / &nbsp; month</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div style={{}} >
        <Pagination defaultCurrent={1} total={50} />

      </div>
    </div>
  </div>
);

export default CityList;

