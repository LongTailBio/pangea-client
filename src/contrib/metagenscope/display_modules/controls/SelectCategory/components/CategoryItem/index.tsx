import * as React from 'react';

interface CategoryItemProps {
  name: string;
  color: string;
  focusReceived(category: string): void;
}

class CategoryItem extends React.Component<CategoryItemProps, {}> {
  constructor(props: CategoryItemProps) {
    super(props);

    this.mouseEntered = this.mouseEntered.bind(this);
  }

  mouseEntered() {
    this.props.focusReceived(this.props.name);
  }

  render() {
    return (
      <li onMouseEnter={this.mouseEntered}>
        <span style={{ backgroundColor: this.props.color }} />{' '}
        {this.props.name.displayFormat()}
      </li>
    );
  }
}

export default CategoryItem;
