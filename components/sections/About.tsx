import React from 'react';

const About = (): JSX.Element => {
    return (
        <div id="about" className="px-4 pt-16 relative">
          <h2 className="text-4xl mb-4 font-bold">About Me</h2>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            nisl eros, pulvinar facilisis justo mollis, auctor consequat urna.
            Morbi a bibendum metus. Donec scelerisque sollicitudin enim eu
            venenatis. Duis tincidunt, mauris in vehicula lacinia, lacus nisl
            consectetur nisi, non tempor mauris ex a mauris. Suspendisse in
            vestibulum ligula. Nunc rutrum massa in libero blandit, nec luctus
            nulla volutpat.
          </p>
          <p className="mb-4">
            Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper
            nibh, in tempor sapien arcu a ligula. Sed venenatis dolor mi, at
            vehicula ipsum. Consectetur adipiscing elit. Mauris quis risus vitae
            turpis interdum consequat ut quis arcu. Curabitur quis accumsan
            sapien, proin mattis viverra.
          </p>
          <p className="mb-4">
            Pellentesque vitae fermentum quam. Vivamus non vehicula ipsum, in
            tincidunt mauris. Nunc aliquet, ipsum a aliquet facilisis, urna
            lorem dictum neque, quis accumsan diam nibh a metus. Fusce eu velit
            volutpat, dictum enim at, viverra ex. In in dolor quis purus
            ullamcorper vulputate in at odio.
          </p>
        </div>
    );
};

export default About;