import styled from 'styled-components';

const UploadWrapper = styled.div`
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  background-color: var(--background-light);
  transition: border-color var(--transition), background-color var(--transition);
  cursor: pointer;
  &:hover {
    border-color: var(--primary-color);
  }

  &.active {
    border-style: dashed;
    border-color: var(--primary-color);
    background-color: #e9f5ff;
  }

  input[type='file'] {
    position: absolute;
    top:0; left:0;
    width:100%; height:100%;
    opacity:0; cursor:pointer;
  }

  p {
    color: #666;
    font-size: 1.2rem;
    margin: 1rem 0 0;
  }

  @media (prefers-color-scheme: dark) {
    background-color: var(--background-dark);
    p { color: #ccc; }
    &.active {
      border-color: #66b0ff;
      background-color: #1a2a3a;
    }
  }
`;

export function UploadArea({ isActive, onFileChange }) {
    return (
        <UploadWrapper className={isActive ? 'active' : ''}>
            <input type="file" accept=".zip" onChange={onFileChange} />
            <p>Drag and drop your ZIP file here or click to upload.</p>
        </UploadWrapper>
    );
}
