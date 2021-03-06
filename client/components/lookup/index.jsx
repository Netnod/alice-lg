
/*
 * Alice (Prefix-)Lookup
 */

import {debounce} from 'underscore'

import React from 'react'
import {connect} from 'react-redux'
import {replace} from 'react-router-redux'

import {setLookupQueryValue} from './actions'

import Content from 'components/content'

import LookupResults from './results'
import SearchInput from 'components/search-input'

import QuickLinks from 'components/routeservers/routes/quick-links'


class LookupHelp extends React.Component {
  render() {
    if(this.props.query != '') {
      return null;
    }

    return (
      <div className="lookup-help">
        <h3>Did you know?</h3>
        <p>You can search for</p>
        <ul>
          <li><b>Prefixes</b>,</li>
          <li><b>Peers</b> by entering their name and</li>
          <li><b>ASNs</b> by prefixing them with 'AS'</li>
        </ul>
        <p>Just start typing!</p>
      </div>
    );
  }
}


class Lookup extends React.Component {

  constructor(props) {
    super(props);
    this.debouncedDispatch = debounce(this.props.dispatch, 400);
  }

  doLookup(q) {
    // Make path
    const destination = {
      pathname: "/search",
      search: `?q=${q}`
    };

    // Set lookup params
    this.props.dispatch(setLookupQueryValue(q));
    this.debouncedDispatch(replace(destination));
  }

  componentDidMount() {
    // this is yucky but the debounced
    // search input seems to kill the ref=
    let input = document.getElementById('lookup-search-input');
    input.focus();
    let value = input.value;
    input.value = "";
    input.value = value;
  }

  render() {
    return (
      <div className="lookup-container">
        <div className="card">
          <h2><Content id="lookup.title">Search on all route servers</Content></h2>
          <SearchInput
            ref="searchInput"
            id="lookup-search-input"
            value={this.props.queryValue}
            placeholder="Search for Prefixes, Peers or ASNs on all Route Servers"
            onChange={(e) => this.doLookup(e.target.value)}  />
        </div>

        <QuickLinks routes={this.props.routes}
                    excludeNotExported={true} />

        <LookupHelp query={this.props.query} />

        <LookupResults />
      </div>
    )
  }
}

export default connect(
  (state) => {
    const lookup = state.lookup;
    return {
      query: state.lookup.query,
      queryValue: state.lookup.queryValue,
      isLoading: state.lookup.isLoading,
      error: state.lookup.error,
      routes: {
        filtered: {
          loading: lookup.isLoading,
          totalResults: lookup.totalRoutesFiltered,
        },
        received: {
          loading: lookup.isLoading,
          totalResults: lookup.totalRoutesImported,
        },
        notExported: {
          loading: false,
          totalResults: 0,
        }
      }
    }
  }
)(Lookup);

