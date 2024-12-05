import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top:0; left:0; width:100%; height:100%;
  background-color: rgba(0,0,0,0.5);
  display:flex; align-items:center; justify-content:center;
  z-index:9999;

  p {
    color: #fff;
    font-size: 2rem;
    background-color: rgba(0,0,0,0.7);
    padding: 1rem 2rem;
    border-radius: 10px;
    border: 2px dashed #fff;
    text-align:center;
  }

  @media (prefers-color-scheme: dark) {
    background-color: rgba(0, 0, 0, 0.7);
    p {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: #66b0ff;
      color: #e0e0e0;
    }
  }
`;

export function DragOverlay() {
    return (
        <Overlay>
            <p>Drop your ZIP file here</p>
        </Overlay>
    );
}
