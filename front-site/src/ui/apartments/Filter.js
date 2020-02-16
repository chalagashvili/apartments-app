import React from 'react';
import { Icon, InputNumber } from 'antd';

class Filter extends React.Component {
  state = { isOpen: false }

  render() {
    return (
      <div style={{
        display: 'flex',
        padding: '0 20px 20px',
        backgroundColor: 'white',
        width: '100%',
        position: 'relative',
      }}
      >
        <div
          style={{
            border: '1px solid rgb(176, 176, 176)', marginRight: 10, cursor: 'pointer', padding: '8px 16px', borderRadius: 5, color: 'black',
          }}
          onClick={() => this.setState({ isOpen: true })}
        >Filter
        </div>
        <div
          onClick={() => this.props.searchByMapToggle()}
          style={{
            border: '1px solid rgb(176, 176, 176)',
            marginRight: 10,
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: 5,
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
          }}
        > {this.props.searchByMap ? <Icon width={15} height={25} style={{ marginRight: 6, fontSize: 18 }} type="check-square" /> : <div style={{
          marginRight: 8, border: '1px solid black', width: 16, height: 16,
        }}
        />}  Search as I move the map
        </div>
        {this.state.isOpen ? <div style={{
          position: 'absolute',
          top: 50,
          left: 20,
          backgroundColor: 'white',
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'rgba(0, 0, 0, 0.18) 0px 3px 5px',
          padding: 20,
          paddingRight: 50,
        }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', marginTop: 20, justifyContent: 'space-between',
          }}
          >
            <div style={{ marginRight: 20 }} >Price: ($)</div>
            <InputNumber
              defaultValue={100}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', marginTop: 40, justifyContent: 'space-between',
          }}
          >
            <div style={{ marginRight: 20 }} >Size: (m²)</div>
            <InputNumber
              defaultValue={40}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', marginTop: 40, justifyContent: 'space-between',
          }}
          >
            <div style={{ marginRight: 20 }} >Rooms: </div>
            <InputNumber
              defaultValue={3}
              min={0}
              max={100}
              formatter={value => `${value}`}
            />
          </div>
          <div
            style={{
              marginTop: 30,
              width: 'max-content',
              cursor: 'pointer',
              border: '1px solid black',
              color: 'rgb(34, 34, 34)',
              padding: '5px 20px',
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => this.setState({ isOpen: false })}
          >Search
          </div>
        </div> : null}

      </div>
    );
  }
}


export default Filter;
