/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';

import SearchInput from '../../components/SearchInput';
import FilterContext from '../../contexts/FilterContext';
import UserContext from '../../contexts/UserContext';

const ProspectsDrawer = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useContext(FilterContext);
  const [user] = useContext(UserContext);
  useEffect(() => {
    if (user) {
      fetch('/user/campaigns_list', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then((response) => response.json())
        .then((d) => setCampaigns(d))
        .then(() => console.log(campaigns))
        .catch((err) => console.log(err));
    }
  }, [user]);
  return (
    <>
      <SearchInput search={filter} setSearch={setFilter} />
    </>
  );
};

export default ProspectsDrawer;
