import * as React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';

import CategoryItem from './components/CategoryItem';
import './style.css';

type CategoryProps = {
  label?: string;
  categories: string[];
  selectedCategoryName: string;
  categoryValues: {
    name: string;
    color: string;
  }[];
  colorByCategoryChanged(name: string): void;
  activeCategoryChanged?(name?: string): void;
};

class SelectCategory extends React.Component<CategoryProps, {}> {
  constructor(props: CategoryProps) {
    super(props);

    this.focusChanged = this.focusChanged.bind(this);
    this.focusLost = this.focusLost.bind(this);
    this.handleColorByCategoryChange = this.handleColorByCategoryChange.bind(
      this,
    );
  }

  focusLost() {
    if (this.props.activeCategoryChanged !== undefined) {
      this.props.activeCategoryChanged(undefined);
    }
  }

  focusChanged(category: string) {
    if (this.props.activeCategoryChanged !== undefined) {
      this.props.activeCategoryChanged(category);
    }
  }

  handleColorByCategoryChange(event: React.FormEvent<HTMLSelectElement>) {
    const newColorByCategory = event.currentTarget.value;
    this.props.colorByCategoryChanged(newColorByCategory);
  }

  render() {
    let label = 'Color by category:';
    if (this.props.label !== undefined) {
      label = this.props.label;
    }

    return (
      <form>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>{label}</ControlLabel>
          <select
            className="form-control"
            value={this.props.selectedCategoryName}
            onChange={this.handleColorByCategoryChange}
          >
            {this.props.categories.map((categoryName, index) => {
              return (
                <option key={index} value={categoryName}>
                  {categoryName.displayFormat()}
                </option>
              );
            })}
          </select>
        </FormGroup>
        <FormGroup>
          <ul className="categories-control" onMouseLeave={this.focusLost}>
            {this.props.categoryValues.map((categoryValue, index) => {
              return (
                <CategoryItem
                  key={index}
                  name={categoryValue.name}
                  color={categoryValue.color}
                  focusReceived={this.focusChanged}
                />
              );
            })}
          </ul>
        </FormGroup>
      </form>
    );
  }
}

export default SelectCategory;
