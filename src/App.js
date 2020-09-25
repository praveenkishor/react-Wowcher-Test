import React, { Component } from "react";
import "./App.css";

const formatNumber = (number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);
class App extends Component {
  constructor() {
    super()
    this.state = {
      products: [],
      search: '',
    }

  }
  componentDidMount() {
    const getCovidData = async () => {
      const request1 = await fetch("api/branch1.json");
      const data1 = await request1.json();

      const request2 = await fetch("api/branch2.json");
      const data2 = await request2.json();

      const request3 = await fetch("api/branch3.json");
      const data3 = await request3.json();

      let result = Object.values([...data1.products, ...data2.products, ...data3.products].reduce((acc, { id, name, unitPrice, sold }) => {
        acc[id] = { id, name, unitPrice, sold: (acc[id] ? acc[id].sold : 0) + sold };
        return acc;
      }, {}));

      result.sort(function (a, b) {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      })
      this.setState({
        product: result,
      });

      console.log(result);
    };
    getCovidData();

  }
  render() {
    const products = this.state.search ? this.state.product.filter(item => item.name.toLowerCase().includes(this.state.search.toLowerCase())) : this.state.product;
    let total = 0;
    return (
      <div className="product-list">
        <label>Search Products</label>
        <input type="text" value={this.state.search} onChange={(event) => this.setState({ search: event.target.value })} />

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
          <tfoot>
            {
              products && products.map((item, index) => {
                total = total + (item.unitPrice * item.sold)
                return (
                  <tr key={index.toString()}>
                    <td>{item.name}</td>
                    <td>{formatNumber(item.unitPrice * item.sold)}</td>
                  </tr>
                )
              })
            }


            <tr>
              <td>Total</td>
              <td>{formatNumber(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default App;
