import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface transaction {
  _id: string;
  result: string;
  cursor: string;
  count: string;
  transactions: { [keys: string]: string }[];
}

const API_HOST: string = 'http://localhost:5000';
const INVENTORY_API_URL = `${API_HOST}/transactions`;

function App() {
  const [data, setData] = useState<transaction[]>([]);

  // GET request function to your Mock API
  const fetchInventory = () => {
    fetch(`${INVENTORY_API_URL}`, { mode: 'cors' })
      .then((res) => res.json())
      .then((json: transaction[]) => setData(json));
  };
  const formatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumSignificantDigits: 10,
  });
  const bitFormatter = Intl.NumberFormat('en-US', {
    minimumSignificantDigits: 10,
  });
  const date = new Intl.DateTimeFormat([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  // Calling the function on component mount
  useEffect(() => {
    fetchInventory();
  }, []);
  if (data) {
    return (
      <div className="container">
        <h1>Transaction table</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Blockchain</th>
              <th>Symbol</th>
              <th>Transaction type</th>
              <th>Amount</th>
              <th>Amount USD</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((x) => {
              if (parseInt(x.count) > 0) {
                return x.transactions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.blockchain}</td>
                    <td>{item.symbol}</td>
                    <td>{item.transaction_type}</td>
                    <td>
                      {bitFormatter.format(parseInt(item.amount))}
                    </td>
                    <td>
                      {formatter.format(parseInt(item.amount_usd))}
                    </td>
                    <td>
                      {date.format(parseInt(item.timestamp + '000'))}
                    </td>
                  </tr>
                ));
              } else {
                return null;
              }
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

ReactDOM.render(<App />, document.querySelector('#root'));
