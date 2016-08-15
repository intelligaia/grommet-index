// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import debounce from 'debounce';
import classnames from 'classnames';
import Header from 'grommet/components/Header';
import Search from 'grommet/components/Search';
import Box from 'grommet/components/Box';
import Filters from './Filters';
import IndexPropTypes from '../utils/PropTypes';
import IndexQuery from '../utils/Query';
import Intl from 'grommet/utils/Intl';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';
import FilterIcon from 'grommet/components/icons/base/Filter';

const CLASS_ROOT = 'index-header';

export default class IndexHeader extends Component {

  constructor () {
    super();
    this._onChangeSearch = this._onChangeSearch.bind(this);
    this._onQuery = debounce(this._onQuery.bind(this), 300);
    this.state = {
      value: ''
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.query !== nextProps.query) {
      this.setState({ value: nextProps.query ? nextProps.query.toString() : '' });
    }
  }

  _onChangeSearch (event) {
    const value = event.target.value;
    this.setState({ value });
    this._onQuery(value);
  }

  _onQuery (value) {
    this.props.onQuery(new IndexQuery(value));
  }

  render () {
    const { attributes } = this.props;
    const data = this.props.data || {};

    const classes = classnames(CLASS_ROOT, this.props.className);

    const filterOrSortAttributes = attributes.filter(a => a.filter || a.sort);
    const selectedFilterCount = Object.keys(this.props.filter).length;
    const icon = (
      <FilterIcon colorIndex={selectedFilterCount ? 'brand' : undefined} />
    );
    let a11yTitle = Intl.getMessage(this.context.intl, 'Filter');

    let filters;
    if (filterOrSortAttributes.length > 0) {
      filters = !this.props.inlineFilterOpen && (
        <Button plain={true} onClick={this.props.toggleInlineFilter}>
          <FilterIcon />
        </Button>
      );

      if (this.props.filterType === 'menu') {
        filters = (
          <div className={`${CLASS_ROOT}__filters no-flex`}>
            <Menu className={CLASS_ROOT + "__menu"} icon={icon}
              dropAlign={{right: 'right'}} a11yTitle={a11yTitle}
              direction="column" closeOnClick={false}>
              <Filters attributes={filterOrSortAttributes}
                direction={this.props.filterDirection}
                values={this.props.filter} sort={this.props.sort}
                onChange={this.props.onFilter}
                onSort={this.props.onSort} />
            </Menu>
            {this.props.filterCounts}
          </div>
        );
      }
    }

    const placeHolder = Intl.getMessage(this.context.intl, 'Search');

    return (
      <Header className={classes}
        pad={{horizontal: 'medium', between: 'small'}}
        fixed={this.props.fixed} size="large">
        {this.props.navControl}
        <span className={`${CLASS_ROOT}__label`}>{this.props.label}</span>
        <Box className={`${CLASS_ROOT}__controls flex`} direction="row"
          align="center" justify="end" responsive={false}>
          <Search className={`${CLASS_ROOT}__search flex`}
            inline={true}
            placeHolder={placeHolder}
            value={this.state.value}
            onDOMChange={this._onChangeSearch} />
          {filters}
          {this.props.addControl}
        </Box>
      </Header>
    );
  }

}

IndexHeader.propTypes = {
  addControl: PropTypes.node,
  attributes: IndexPropTypes.attributes.isRequired,
  filter: PropTypes.object, // { name: [value, ...] }
  filterDirection: PropTypes.oneOf(['row', 'column']),
  fixed: PropTypes.bool,
  label: PropTypes.string.isRequired,
  navControl: PropTypes.node,
  onFilter: PropTypes.func, // (filters)
  onQuery: PropTypes.func, // (query)
  onSort: PropTypes.func, // (sort)
  query: PropTypes.instanceOf(IndexQuery), // instance of Query
  data: IndexPropTypes.data,
  sort: PropTypes.string
};

IndexHeader.contextTypes = {
  intl: PropTypes.object
};

IndexHeader.defaultProps = {
  filterDirection: 'column'
};
