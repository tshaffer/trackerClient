import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Category, CategoryAssignmentRule } from '../types';
import { TrackerDispatch } from '../models';
import { getCategories, getCategoryAssignmentRules } from '../selectors';

interface UploadedCategoryData {
  categoryName: string;
  pattern: string;
}

export interface DownloadCategoryAssignmentRulesProps {
  categories: Category[];
  categoryAssignmentRules: CategoryAssignmentRule[];
}

const UploadCategoryAssignmentRules: React.FC<any> = (props: any) => {

  const [uploadedData, setUploadedData] = React.useState<UploadedCategoryData[]>([]);

  const categoryAssignmentRules: CategoryAssignmentRule[] = props.categoryAssignmentRules;
  const categories: Category[] = props.categories;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          const data: UploadedCategoryData[] = JSON.parse(jsonString);
          setUploadedData(data);
          console.log('Uploaded data:', data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/json"
        onChange={handleFileUpload}
      />
      {uploadedData.length > 0 && (
        <div>
          <h3>Uploaded Categories</h3>
          <ul>
            {uploadedData.map((item, index) => (
              <li key={index}>
                <strong>Category Name:</strong> {item.categoryName} <br />
                <strong>Pattern:</strong> {item.pattern}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadCategoryAssignmentRules);

