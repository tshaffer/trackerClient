import React from 'react';
// import { useSelector } from 'react-redux';
// import { getCategories } from '../selectors';

const categories: any[] = [
  { id: 1, name: 'Groceries' },
  { id: 2, name: 'Rent' },
  { id: 3, name: 'Utilities' },
  { id: 4, name: 'Entertainment' },
];
const CategoriesList: React.FC = () => {

  // const categories = useSelector(getCategories);

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map(category => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;