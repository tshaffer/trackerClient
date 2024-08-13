import React from 'react';
import { useSelector } from 'react-redux';
import { getCategoryAssignmentRules } from '../selectors';

const CategoryAssignmentRulesT: React.FC = () => {
  const rules = useSelector(getCategoryAssignmentRules);

  return (
    <div>
      <h1>Category Assignment Rules</h1>
      <ul>
        {rules.map(rule => (
          <li key={rule.id}>{rule.pattern}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryAssignmentRulesT;