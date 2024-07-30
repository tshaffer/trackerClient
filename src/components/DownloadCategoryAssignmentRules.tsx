import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Category, CategoryAssignmentRule } from '../types';
import { TrackerDispatch } from '../models';
import { getCategories, getCategoryAssignmentRules } from '../selectors';

export interface DownloadCategoryAssignmentRulesProps {
  categories: Category[];
  categoryAssignmentRules: CategoryAssignmentRule[];
}

const DownloadCategories: React.FC<any> = (props: any) => {

  const categoryAssignmentRules: CategoryAssignmentRule[] = props.categoryAssignmentRules;
  const categories: Category[] = props.categories;

  const handleDownload = () => {
    // Transform the data
    const data = categoryAssignmentRules.map(rule => {
      const category = categories.find(cat => cat.id === rule.categoryId);
      return {
        categoryName: category ? category.name : 'Unknown',
        pattern: rule.pattern,
      };
    });

    // Convert to JSON
    const jsonString = JSON.stringify(data, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a link element
    const link = document.createElement('a');

    // Set the download attribute with a filename
    link.download = 'categories.json';

    // Create a URL for the blob and set it as the href attribute
    link.href = window.URL.createObjectURL(blob);

    // Append the link to the document body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload}>Download Categories</button>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    categories: getCategories(state),
    categoryAssignmentRules: getCategoryAssignmentRules(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadCategories);

