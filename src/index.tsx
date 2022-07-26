import { FormEvent, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

interface transaction {
  count: string;
  id: string;
  transactions: { [keys: string]: string };
}

const INVENTORY_API_URL: string = 'http://localhost:5000';

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [input, setInput] = useState('');
  let URL_APPEND = '?';
  const [loadStage, setloadStage] = useState('');
  const [data, setData] = useState<transaction[]>([]);
  const [blockchain, setBlockchain] = useState('');
  const [symbol, setSymbol] = useState('');

  // GET request function to your Mock API
  const fetchInventory = () => {
    if (blockchain !== '') {
      URL_APPEND += `blockchain=${blockchain}`;
    }
    if (symbol !== '') {
      URL_APPEND += `&&symbol=${symbol}`;
    }
    setloadStage('Loading...');
    URL_APPEND += `&&page=${pageNumber}`;
    fetch(`${INVENTORY_API_URL + URL_APPEND}`, { mode: 'cors' })
      .then((res) => res.json())
      .then((json: transaction[]) => setData(json))
      .then(() => {
        setloadStage('');
      });
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

  // const sortData = [
  //   { label: 'ID', value: 1 },
  //   { label: 'Blockchain', value: 2 },
  //   { label: 'Symbol', value: 3 },
  //   { label: 'Amount', value: 4 },
  //   { label: 'Amount USD', value: 5 },
  //   { label: 'Timestamp', value: 6 },
  // ];

  const Blockchain = [
    { label: 'All', value: '' },
    { label: 'Bitcoin', value: 'bitcoin' },
    { label: 'Ethereum', value: 'ethereum' },
    { label: 'Stellar', value: 'stellar' },
    { label: 'Ripple', value: 'ripple' },
    { label: 'Neo', value: 'neo' },
    { label: 'Tron', value: 'tron' },
    { label: 'Tezos', value: 'tezos' },
    { label: 'Binance Chain', value: 'binancechain' },
    { label: 'EOS', value: 'eos' },
    { label: 'Steem', value: 'steem' },
    { label: 'Icon', value: 'icon' },
  ];

  const Symbol = [
    { label: 'All', value: '' },
    { label: 'BTC', value: 'btc' },
    { label: 'ETH', value: 'eth' },
    { label: 'XML', value: 'xml' },
    { label: 'XRP', value: 'xrp' },
    { label: 'NEO', value: 'neo' },
    { label: 'TRX', value: 'trx' },
    { label: 'XTZ', value: 'xtz' },
    { label: 'BNB', value: 'bnb' },
    { label: 'EOS', value: 'eos' },
    { label: 'STEEM', value: 'steem' },
    { label: 'ICX', value: 'icx' },
    { label: 'USDT', value: 'usdt' },
    { label: 'USDC', value: 'usdc' },
    { label: 'GUSD', value: 'gusd' },
    { label: 'DAI', value: 'dai' },
    { label: 'PAX', value: 'pax' },
    { label: 'TUSD', value: 'tusd' },
    { label: 'HUSD', value: 'husd' },
    { label: 'BUSD', value: 'busd' },
  ];

  const prevPage = async () => {
    if (pageNumber > 1) {
      await setPageNumber(pageNumber - 1);
    } else {
      await setPageNumber(1);
    }
  };

  const nextPage = async () => {
    await setPageNumber(pageNumber + 1);
  };

  const keyDownHandler = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.code === 'Enter') {
      const data = parseInt(input);
      if (data) {
        setPageNumber(data);
      } else {
        setInput('' + pageNumber);
      }
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    fetchInventory();
  };

  // Calling the function on component mount
  useEffect(() => {
    setInput('' + pageNumber);
    fetchInventory();
  }, [pageNumber]);

  if (data) {
    return (
      <div className="container">
        <h1>Transaction table</h1>
        <h3>
          <i>{loadStage}</i>
        </h3>
        <button onClick={prevPage}>Previous page</button>
        <input
          onKeyDown={keyDownHandler}
          type="text"
          className="text-input"
          value={input}
          onClick={() => setInput('')}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <button onClick={nextPage}>Next page</button>
        <form onSubmit={handleSubmit}>
          <h5>Blockchain</h5>
          <Select
            options={Blockchain}
            defaultValue={{ label: 'All', value: '' }}
            onChange={(value) => {
              if (value) setBlockchain(value.value);
            }}
          />
          <h5>Symbol</h5>
          <Select
            options={Symbol}
            defaultValue={{ label: 'All', value: '' }}
            onChange={(value) => {
              if (value) setSymbol(value.value);
            }}
          />
          <input type="submit" value="Submit" />
        </form>
        <table>
          <thead>
            <tr>
              <th>Transaction Id</th>
              <th>Blockchain</th>
              <th>Symbol</th>
              <th>Amount</th>
              <th>Amount USD</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((x) => {
              let item = x.transactions;
              return (
                <tr key={parseInt(x.id)}>
                  <td>{item.id}</td>
                  <td>{item.blockchain}</td>
                  <td>{item.symbol}</td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
