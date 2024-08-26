// ShoppingList.js
import React, { Component } from 'react';
import axios from 'axios';

class ShoppingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dishName: '',
            shoppingList: null,
            error: null,
            isLoading: false 
        };
    }

    handleInputChange = (e) => {
        this.setState({ dishName: e.target.value });
    };

    handleGenerateList = async () => {
        this.setState({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/generate-shopping-list/', { dish_name: this.state.dishName });
            this.setState({ shoppingList: response.data.shopping_list, error: null });
        } catch (err) {
            this.setState({ error: 'Error generating shopping list. Please try again.', shoppingList: null });
        }
        this.setState({ isLoading: false});
    };

    render() {
        return (
            <div className="card p-4 my-4">
                <h3 className="card-title">Generate Shopping List</h3>
                <div className="form-group">
                    <input
                        type="text"
                        value={this.state.dishName}
                        onChange={this.handleInputChange}
                        className="form-control"
                        placeholder="Enter dish name"
                    />
                </div>
                <button onClick={this.handleGenerateList} className="btn btn-primary">
                    {this.state.isLoading ? 'Generating...' : 'Generate Shopping List'}
                </button>
                {this.state.error && <p className="text-danger mt-3">{this.state.error}</p>}
                {this.state.shoppingList && (
                    <pre className="mt-3 bg-light p-3 border rounded">{this.state.shoppingList}</pre>
                )}
            </div>
        );
    }
}

export default ShoppingList;
